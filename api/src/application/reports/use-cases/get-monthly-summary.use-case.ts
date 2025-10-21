import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '../../../domain/common/enums';
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

    const installments = await this.prisma.installment.findMany({
      where: {
        OR: [
          {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
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
      
      const dueInMonth = installment.dueDate >= startDate && installment.dueDate <= endDate;
      const paidInMonth = installment.paidDate && 
                          installment.paidDate >= startDate && 
                          installment.paidDate <= endDate;

      if (dueInMonth) {
        totalExpected += amount;
        
        if (installment.status === PaymentStatus.PAGO) {
          paidInstallments++;
        } else if (installment.status === PaymentStatus.ATRASADO) {
          overdueInstallments++;
          totalOverdue += amount - paidAmount;
        } else {
          if (installment.dueDate < now) {
            overdueInstallments++;
            totalOverdue += amount - paidAmount;
          } else {
            upcomingInstallments++;
            totalPending += amount - paidAmount;
          }
        }
      }

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
