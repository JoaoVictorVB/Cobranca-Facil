import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';

interface MonthRevenue {
  month: string;
  expected: number;
  received: number;
}

@Injectable()
export class GetRevenueChartUseCase implements IUseCase<object, MonthRevenue[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: object, userId?: string): Promise<MonthRevenue[]> {
    const monthsCount = 12;
    const now = new Date();
    const results: MonthRevenue[] = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

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
          ...(userId
            ? {
                sale: {
                  client: {
                    userId,
                  },
                },
              }
            : {}),
        },
      });

      let totalExpected = 0;
      let totalReceived = 0;

      for (const installment of installments) {
        const amount = Number(installment.amount);
        const paidAmount = Number(installment.paidAmount || 0);

        const dueInMonth = installment.dueDate >= startDate && installment.dueDate <= endDate;
        const paidInMonth =
          installment.paidDate &&
          installment.paidDate >= startDate &&
          installment.paidDate <= endDate;

        if (dueInMonth) {
          totalExpected += amount;
        }

        if (paidInMonth) {
          totalReceived += paidAmount;
        }
      }

      results.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        expected: Number(totalExpected.toFixed(2)),
        received: Number(totalReceived.toFixed(2)),
      });
    }

    return results;
  }
}
