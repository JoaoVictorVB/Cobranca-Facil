import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { PeriodSummary } from '../interfaces/reports.interfaces';

interface GetPeriodSummaryRequest {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class GetPeriodSummaryUseCase implements IUseCase<GetPeriodSummaryRequest, PeriodSummary> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetPeriodSummaryRequest): Promise<PeriodSummary> {
    const { startDate, endDate } = request;

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
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const now = new Date();

    for (const installment of installments) {
      totalExpected += installment.amount;

      if (installment.status === 'pago') {
        totalReceived += installment.paidAmount || installment.amount;
        paidCount++;
      } else if (installment.status === 'atrasado') {
        totalOverdue += installment.amount;
        overdueCount++;
      } else if (installment.dueDate > now) {
        totalPending += installment.amount;
        pendingCount++;
      } else {
        totalOverdue += installment.amount;
        overdueCount++;
      }
    }

    const receivedPercentage = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalExpected,
      totalReceived,
      totalPending,
      totalOverdue,
      receivedPercentage,
      installmentsCount: installments.length,
      paidCount,
      pendingCount,
      overdueCount,
    };
  }
}
