import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { TopClient } from '../interfaces/reports.interfaces';

interface GetTopClientsRequest {
  limit?: number;
}

@Injectable()
export class GetTopClientsUseCase implements IUseCase<GetTopClientsRequest, TopClient[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetTopClientsRequest): Promise<TopClient[]> {
    const limit = request.limit || 5;

    const clients = await this.prisma.client.findMany({
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
          totalPurchases += sale.totalValue;
          totalPaid += sale.totalPaid;
          totalPending += sale.totalValue - sale.totalPaid;
        }

        return {
          clientId: client.id,
          clientName: client.name,
          totalPurchases,
          totalPaid,
          totalPending,
        };
      })
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, limit);

    return clientStats;
  }
}
