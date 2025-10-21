import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IUseCase } from '../../common/use-case.interface';
import { PaymentStatus } from '../interfaces/reports.interfaces';

@Injectable()
export class GetPaymentStatusUseCase implements IUseCase<void, PaymentStatus[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<PaymentStatus[]> {
    const installments = await this.prisma.installment.findMany({
      select: {
        status: true,
        amount: true,
        paidAmount: true,
      },
    });

    const statusMap = new Map<string, { count: number; totalAmount: number }>();

    for (const installment of installments) {
      const status = installment.status;
      const existing = statusMap.get(status) || { count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount +=
        status === 'pago' ? installment.paidAmount || installment.amount : installment.amount;
      statusMap.set(status, existing);
    }

    return Array.from(statusMap.entries()).map(([status, data]) => ({
      status: status as 'pago' | 'pendente' | 'atrasado',
      count: data.count,
      totalAmount: data.totalAmount,
    }));
  }
}
