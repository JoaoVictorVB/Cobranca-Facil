import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface MonthlyExpectedRevenue {
  month: string;
  year: number;
  expected: number;
}

@Injectable()
export class GetExpectedRevenueUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<MonthlyExpectedRevenue[]> {
    const now = new Date();
    const result: MonthlyExpectedRevenue[] = [];

    for (let i = 0; i < 6; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const installments = await this.prisma.installment.findMany({
        where: {
          dueDate: {
            gte: startDate,
            lte: endDate,
          },
          sale: {
            userId: userId,
          },
        },
      });

      const expectedRevenue = installments.reduce(
        (sum, installment) => sum + installment.amount,
        0,
      );

      const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ];

      result.push({
        month: monthNames[month - 1],
        year,
        expected: expectedRevenue,
      });
    }

    return result;
  }
}
