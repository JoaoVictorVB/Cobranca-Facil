import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { TopClient } from '../interfaces/reports.interfaces';

interface GetTopClientsChartRequest {
  limit?: number;
}

@Injectable()
export class GetTopClientsChartUseCase implements IUseCase<GetTopClientsChartRequest, TopClient[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetTopClientsChartRequest, userId?: string): Promise<TopClient[]> {
    const limit = request.limit || 10;
    const clients = await this.prisma.client.findMany({
      where: userId ? { userId } : undefined,
      include: {
        sales: {
          include: {
            installments: true,
          },
        },
      },
    });

    const clientStats = clients
      .map((client) => {
        let totalPurchases = 0;
        let totalPaid = 0;
        let totalPending = 0;

        for (const sale of client.sales) {
          const saleValue = Number(sale.totalValue);
          const salePaid = Number(sale.totalPaid);

          totalPurchases += saleValue;
          totalPaid += salePaid;
          totalPending += saleValue - salePaid;
        }

        return {
          clientId: client.id,
          clientName: client.name,
          totalPurchases: Number(totalPurchases.toFixed(2)),
          totalPaid: Number(totalPaid.toFixed(2)),
          totalPending: Number(totalPending.toFixed(2)),
        };
      })
      .filter((client) => client.totalPurchases > 0)
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, limit);

    return clientStats;
  }
}
