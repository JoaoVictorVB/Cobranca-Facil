import { Injectable } from '@nestjs/common';
import { PaymentFrequency } from '../../domain/common/enums';
import { Sale } from '../../domain/sale/entities/sale.entity';
import { ISaleRepository } from '../../domain/sale/repositories/sale.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SaleRepository implements ISaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sale: Sale, userId: string): Promise<Sale> {
    const created = await this.prisma.sale.create({
      data: {
        id: sale.id,
        clientId: sale.clientId,
        itemDescription: sale.itemDescription,
        totalValue: sale.totalValue.amount,
        totalInstallments: sale.totalInstallments,
        paymentFrequency: sale.paymentFrequency,
        firstDueDate: sale.firstDueDate,
        totalPaid: sale.totalPaid.amount,
        saleDate: sale.saleDate,
        userId: userId,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string, userId?: string): Promise<Sale | null> {
    const where: any = { id };
    if (userId) where.userId = userId;

    const sale = await this.prisma.sale.findFirst({
      where,
    });

    return sale ? this.toDomain(sale) : null;
  }

  async findAll(userId?: string, page?: number, limit?: number): Promise<Sale[]> {
    const query: any = {
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const sales = await this.prisma.sale.findMany(query);

    return sales.map((sale) => this.toDomain(sale));
  }

  async findByClientId(clientId: string, userId?: string): Promise<Sale[]> {
    const where: any = { clientId };
    if (userId) where.userId = userId;

    const sales = await this.prisma.sale.findMany({
      where,
      orderBy: { saleDate: 'desc' },
    });

    return sales.map((sale) => this.toDomain(sale));
  }

  async update(sale: Sale, userId?: string): Promise<Sale> {
    const where: any = { id: sale.id };
    if (userId) where.userId = userId;

    await this.prisma.sale.updateMany({
      where,
      data: {
        itemDescription: sale.itemDescription,
        totalValue: sale.totalValue.amount,
        totalInstallments: sale.totalInstallments,
        paymentFrequency: sale.paymentFrequency,
        totalPaid: sale.totalPaid.amount,
        updatedAt: sale.updatedAt,
      },
    });

    const fetched = await this.prisma.sale.findFirst({ where });
    if (!fetched) throw new Error('Sale not found after update');
    return this.toDomain(fetched);
  }

  async delete(id: string, userId?: string): Promise<void> {
    const where: any = { id };
    if (userId) where.userId = userId;

    await this.prisma.sale.deleteMany({ where });
  }

  private toDomain(raw: any): Sale {
    return Sale.create({
      id: raw.id,
      clientId: raw.clientId,
      itemDescription: raw.itemDescription,
      totalValue: raw.totalValue,
      totalInstallments: raw.totalInstallments,
      paymentFrequency: raw.paymentFrequency as PaymentFrequency,
      firstDueDate: raw.firstDueDate,
      totalPaid: raw.totalPaid,
      saleDate: raw.saleDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
