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

  async execute(request: GetMonthlySummaryRequest): Promise<MonthlySummary> {
    const { year, month } = request;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const installments = await this.prisma.installment.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
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
      totalExpected += installment.amount;

      if (installment.status === 'pago') {
        totalReceived += installment.paidAmount || installment.amount;
        paidInstallments++;
      } else if (installment.status === 'atrasado') {
        totalOverdue += installment.amount;
        overdueInstallments++;
      } else if (installment.dueDate > now) {
        totalPending += installment.amount;
        upcomingInstallments++;
      } else {
        totalOverdue += installment.amount;
        overdueInstallments++;
      }
    }

    const receivedPercentage = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

    return {
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalExpected,
      totalReceived,
      totalPending,
      totalOverdue,
      receivedPercentage,
      upcomingInstallments,
      overdueInstallments,
      paidInstallments,
    };
  }
}
