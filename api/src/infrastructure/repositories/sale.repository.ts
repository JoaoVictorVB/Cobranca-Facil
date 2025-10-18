import { Injectable } from '@nestjs/common';
import { PaymentFrequency } from '../../domain/common/enums';
import { Sale } from '../../domain/sale/entities/sale.entity';
import { ISaleRepository } from '../../domain/sale/repositories/sale.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SaleRepository implements ISaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sale: Sale): Promise<Sale> {
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
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
    });

    return sale ? this.toDomain(sale) : null;
  }

  async findAll(page: number = 1, limit: number = 50): Promise<Sale[]> {
    const skip = (page - 1) * limit;
    const sales = await this.prisma.sale.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return sales.map((sale) => this.toDomain(sale));
  }

  async findByClientId(clientId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: { clientId },
      orderBy: { saleDate: 'desc' },
    });

    return sales.map((sale) => this.toDomain(sale));
  }

  async update(sale: Sale): Promise<Sale> {
    const updated = await this.prisma.sale.update({
      where: { id: sale.id },
      data: {
        itemDescription: sale.itemDescription,
        totalValue: sale.totalValue.amount,
        totalInstallments: sale.totalInstallments,
        paymentFrequency: sale.paymentFrequency,
        totalPaid: sale.totalPaid.amount,
        updatedAt: sale.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sale.delete({
      where: { id },
    });
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
