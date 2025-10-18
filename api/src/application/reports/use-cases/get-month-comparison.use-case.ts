import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { MonthComparisonDto } from '../dto/period-summary.dto';

interface GetMonthComparisonRequest {
  months: { year: number; month: number }[];
}

@Injectable()
export class GetMonthComparisonUseCase
  implements IUseCase<GetMonthComparisonRequest, MonthComparisonDto>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetMonthComparisonRequest): Promise<MonthComparisonDto> {
    const monthsData = await Promise.all(
      request.months.map(async ({ year, month }) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const installments = await this.prisma.installment.findMany({
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        let totalExpected = 0;
        let totalReceived = 0;
        let totalPending = 0;
        let totalOverdue = 0;

        const now = new Date();

        for (const installment of installments) {
          totalExpected += installment.amount;

          if (installment.status === 'pago') {
            totalReceived += installment.paidAmount || installment.amount;
          } else if (installment.status === 'atrasado') {
            totalOverdue += installment.amount;
          } else if (installment.dueDate > now) {
            totalPending += installment.amount;
          } else {
            totalOverdue += installment.amount;
          }
        }

        const receivedPercentage =
          totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

        return {
          month: `${year}-${String(month).padStart(2, '0')}`,
          totalExpected,
          totalReceived,
          totalPending,
          totalOverdue,
          receivedPercentage,
        };
      }),
    );

    return {
      months: monthsData,
    };
  }
}
