import { Injectable } from '@nestjs/common';
import {
    StockTransfer,
    TransferItem,
    TransferStatus,
} from '../../domain/distribution/entities/stock-transfer.entity';
import { IStockTransferRepository } from '../../domain/distribution/repositories/stock-transfer.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StockTransferRepository implements IStockTransferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transfer: StockTransfer): Promise<StockTransfer> {
    const data = await this.prisma.stockTransfer.create({
      data: {
        id: transfer.id,
        supplierId: transfer.supplierId,
        resellerId: transfer.resellerId,
        status: transfer.status,
        items: transfer.items as any,
        notes: transfer.notes,
        sentAt: transfer.sentAt,
        receivedAt: transfer.receivedAt,
        createdAt: transfer.createdAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<StockTransfer | null> {
    const data = await this.prisma.stockTransfer.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findBySupplier(supplierId: string): Promise<StockTransfer[]> {
    const data = await this.prisma.stockTransfer.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) => this.toDomain(item));
  }

  async findByReseller(resellerId: string): Promise<StockTransfer[]> {
    const data = await this.prisma.stockTransfer.findMany({
      where: { resellerId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) => this.toDomain(item));
  }

  async findPendingByReseller(resellerId: string): Promise<StockTransfer[]> {
    const data = await this.prisma.stockTransfer.findMany({
      where: {
        resellerId,
        status: 'ENVIADO',
      },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) => this.toDomain(item));
  }

  async update(transfer: StockTransfer): Promise<StockTransfer> {
    const data = await this.prisma.stockTransfer.update({
      where: { id: transfer.id },
      data: {
        status: transfer.status,
        receivedAt: transfer.receivedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stockTransfer.delete({ where: { id } });
  }

  private toDomain(data: any): StockTransfer {
    return StockTransfer.reconstitute({
      id: data.id,
      supplierId: data.supplierId,
      resellerId: data.resellerId,
      status: data.status as TransferStatus,
      items: data.items as TransferItem[],
      notes: data.notes,
      sentAt: data.sentAt,
      receivedAt: data.receivedAt,
      createdAt: data.createdAt,
    });
  }
}
