import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { DailySales } from '../interfaces/reports.interfaces';

interface GetDailySalesRequest {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class GetDailySalesUseCase implements IUseCase<GetDailySalesRequest, DailySales[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetDailySalesRequest): Promise<DailySales[]> {
    const { startDate, endDate } = request;

    const sales = await this.prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        saleDate: 'asc',
      },
    });

    const salesByDate = new Map<string, { totalSales: number; salesCount: number }>();

    for (const sale of sales) {
      const dateKey = sale.saleDate.toISOString().split('T')[0];
      const existing = salesByDate.get(dateKey) || { totalSales: 0, salesCount: 0 };
      existing.totalSales += sale.totalValue;
      existing.salesCount += 1;
      salesByDate.set(dateKey, existing);
    }

    return Array.from(salesByDate.entries()).map(([date, data]) => ({
      date,
      totalSales: data.totalSales,
      salesCount: data.salesCount,
    }));
  }
}
