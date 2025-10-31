import { Injectable } from '@nestjs/common';
import { PaymentStatus as PaymentStatusEnum } from '../../../domain/common/enums';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { PaymentStatus } from '../interfaces/reports.interfaces';

@Injectable()
export class GetPaymentStatusChartUseCase implements IUseCase<string | undefined, PaymentStatus[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId?: string): Promise<PaymentStatus[]> {
    const installments = await this.prisma.installment.findMany({
      where: userId
        ? {
            sale: {
              client: {
                userId,
              },
            },
          }
        : undefined,
      select: {
        status: true,
        amount: true,
        paidAmount: true,
      },
    });

    const statusMap = new Map<string, { count: number; totalAmount: number }>();

    for (const installment of installments) {
      let status = installment.status;
      const amount = Number(installment.amount);
      const paidAmount = Number(installment.paidAmount || 0);

      if (status === PaymentStatusEnum.PAGO && paidAmount >= amount) {
        status = 'pago';
      } else if (paidAmount > 0 && paidAmount < amount) {
        status = 'parcial';
      }

      const existing = statusMap.get(status) || { count: 0, totalAmount: 0 };
      existing.count += 1;

      const amountToAdd = status === 'pago' ? paidAmount : amount;

      existing.totalAmount += amountToAdd;
      statusMap.set(status, existing);
    }

    return Array.from(statusMap.entries()).map(([status, data]) => ({
      status: status as 'pago' | 'pendente' | 'atrasado' | 'parcial',
      count: data.count,
      totalAmount: Number(data.totalAmount.toFixed(2)),
    }));
  }
}
