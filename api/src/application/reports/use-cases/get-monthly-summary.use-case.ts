import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { MonthlySummary } from '../interfaces/reports.interfaces';

interface GetMonthlySummaryRequest {
  year: number;
  month: number;
}

@Injectable()
export class GetMonthlySummaryUseCase
  implements IUseCase<GetMonthlySummaryRequest, MonthlySummary>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetMonthlySummaryRequest, userId?: string): Promise<MonthlySummary> {
    const { year, month } = request;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Buscar parcelas que VENCEM no mês (para "Esperado") 
    // OU que foram PAGAS no mês (para "Recebido")
    const installments = await this.prisma.installment.findMany({
      where: {
        OR: [
          {
            // Parcelas que vencem no mês (para calcular o esperado)
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            // Parcelas que foram pagas no mês (independente do vencimento)
            paidDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
        ...(userId ? {
          sale: {
            client: {
              userId,
            },
          },
        } : {}),
      },
      include: {
        sale: {
          include: {
            client: true,
          },
        },
      },
    });

    let totalExpected = 0;
    let totalReceived = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let paidInstallments = 0;
    let upcomingInstallments = 0;
    let overdueInstallments = 0;

    const now = new Date();

    for (const installment of installments) {
      const amount = Number(installment.amount);
      const paidAmount = Number(installment.paidAmount || 0);
      
      // Verifica se a parcela VENCE no mês
      const dueInMonth = installment.dueDate >= startDate && installment.dueDate <= endDate;
      
      // Verifica se a parcela foi PAGA no mês
      const paidInMonth = installment.paidDate && 
                          installment.paidDate >= startDate && 
                          installment.paidDate <= endDate;

      // Total Esperado = soma das parcelas que VENCEM no mês
      if (dueInMonth) {
        totalExpected += amount;
        
        // Classificar status das parcelas que vencem no mês
        if (installment.status === 'pago') {
          paidInstallments++;
        } else if (installment.status === 'atrasado') {
          totalOverdue += amount;
          overdueInstallments++;
        } else if (installment.dueDate > now) {
          totalPending += amount;
          upcomingInstallments++;
        } else {
          totalOverdue += amount;
          overdueInstallments++;
        }
      }

      // Total Recebido = soma das parcelas PAGAS no mês (independente do vencimento)
      if (paidInMonth) {
        totalReceived += paidAmount;
      }
    }

    const receivedPercentage = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

    return {
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalExpected: Number(totalExpected.toFixed(2)),
      totalReceived: Number(totalReceived.toFixed(2)),
      totalPending: Number(totalPending.toFixed(2)),
      totalOverdue: Number(totalOverdue.toFixed(2)),
      receivedPercentage: Number(receivedPercentage.toFixed(2)),
      upcomingInstallments,
      overdueInstallments,
      paidInstallments,
    };
  }
}
