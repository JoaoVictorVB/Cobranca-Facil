import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '../../domain/common/enums';
import { Installment } from '../../domain/sale/entities/installment.entity';
import { IInstallmentRepository } from '../../domain/sale/repositories/installment.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class InstallmentRepository implements IInstallmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(installment: Installment): Promise<Installment> {
    const created = await this.prisma.installment.create({
      data: {
        id: installment.id,
        saleId: installment.saleId,
        installmentNumber: installment.installmentNumber,
        amount: installment.amount.amount,
        dueDate: installment.dueDate,
        status: installment.status,
        paidDate: installment.paidDate,
        paidAmount: installment.paidAmount?.amount,
        createdAt: installment.createdAt,
        updatedAt: installment.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async createMany(installments: Installment[]): Promise<Installment[]> {
    const data = installments.map((installment) => ({
      id: installment.id,
      saleId: installment.saleId,
      installmentNumber: installment.installmentNumber,
      amount: installment.amount.amount,
      dueDate: installment.dueDate,
      status: installment.status,
      paidDate: installment.paidDate,
      paidAmount: installment.paidAmount?.amount,
      createdAt: installment.createdAt,
      updatedAt: installment.updatedAt,
    }));

    await this.prisma.installment.createMany({ data });

    const created = await this.prisma.installment.findMany({
      where: {
        saleId: installments[0].saleId,
      },
    });

    return created.map((installment) => this.toDomain(installment));
  }

  async findById(id: string): Promise<Installment | null> {
    const installment = await this.prisma.installment.findUnique({
      where: { id },
    });

    return installment ? this.toDomain(installment) : null;
  }

  async findBySaleId(saleId: string): Promise<Installment[]> {
    const installments = await this.prisma.installment.findMany({
      where: { saleId },
      orderBy: { installmentNumber: 'asc' },
    });

    return installments.map((installment) => this.toDomain(installment));
  }

  async findOverdue(): Promise<Installment[]> {
    const installments = await this.prisma.installment.findMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          in: [PaymentStatus.PENDENTE, PaymentStatus.ATRASADO],
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return installments.map((installment) => this.toDomain(installment));
  }

  async findByDueDateRange(startDate: Date, endDate: Date): Promise<Installment[]> {
    const installments = await this.prisma.installment.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: PaymentStatus.PAGO,
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return installments.map((installment) => this.toDomain(installment));
  }

  async update(installment: Installment): Promise<Installment> {
    const updated = await this.prisma.installment.update({
      where: { id: installment.id },
      data: {
        status: installment.status,
        paidDate: installment.paidDate,
        paidAmount: installment.paidAmount?.amount,
        updatedAt: installment.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.installment.delete({
      where: { id },
    });
  }

  private toDomain(raw: any): Installment {
    return Installment.create({
      id: raw.id,
      saleId: raw.saleId,
      installmentNumber: raw.installmentNumber,
      amount: raw.amount,
      dueDate: raw.dueDate,
      status: raw.status as PaymentStatus,
      paidDate: raw.paidDate,
      paidAmount: raw.paidAmount,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
