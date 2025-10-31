import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';

interface ClientStatus {
  status: string;
  count: number;
}

interface GetClientsStatusRequest {
  year?: number;
  month?: number;
}

@Injectable()
export class GetClientsStatusUseCase implements IUseCase<GetClientsStatusRequest, ClientStatus[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(request: GetClientsStatusRequest, userId?: string): Promise<ClientStatus[]> {
    const { year, month } = request;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    }

    const clients = await this.prisma.client.findMany({
      where: {
        userId: userId,
      },
      include: {
        sales: {
          include: {
            installments: true,
          },
        },
      },
    });

    let upToDateCount = 0;
    let overdueCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const client of clients) {
      let hasOverdue = false;

      for (const sale of client.sales) {
        for (const installment of sale.installments) {
          if (startDate && endDate) {
            const dueDate = new Date(installment.dueDate);
            const isInMonth = dueDate >= startDate && dueDate <= endDate;

            if (!isInMonth) continue;
          }

          if (installment.status !== 'pago') {
            const dueDate = new Date(installment.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            if (dueDate < today) {
              hasOverdue = true;
              break;
            }
          }
        }
        if (hasOverdue) break;
      }

      if (hasOverdue) {
        overdueCount++;
      } else {
        upToDateCount++;
      }
    }

    return [
      {
        status: 'em-dia',
        count: upToDateCount,
      },
      {
        status: 'atrasado',
        count: overdueCount,
      },
    ];
  }
}
