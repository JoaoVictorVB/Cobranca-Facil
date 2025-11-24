import { Injectable } from '@nestjs/common';
import { Client } from '../../domain/client/entities/client.entity';
import { IClientRepository } from '../../domain/client/repositories/client.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(client: Client, userId: string): Promise<Client> {
    const created = await this.prisma.client.create({
      data: {
        id: client.id,
        name: client.name,
        phone: client.phone?.value,
        referredBy: client.referredBy,
        observation: client.observation,
        address: client.address,
        userId,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string, userId?: string): Promise<Client | null> {
    const where: any = { id };
    if (userId) where.userId = userId;

    const client = await this.prisma.client.findFirst({
      where,
    });

    return client ? this.toDomain(client) : null;
  }

  async findAll(userId?: string, page?: number, limit?: number): Promise<Client[]> {
    const query: any = {
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const clients = await this.prisma.client.findMany(query);

    return clients.map((client) => this.toDomain(client));
  }

  async findAllWithSales(userId?: string, page?: number, limit?: number): Promise<any[]> {
    const query: any = {
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        sales: {
          include: {
            installments: {
              orderBy: { dueDate: 'asc' },
            },
          },
        },
      },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const clients = await this.prisma.client.findMany(query);

    return clients.map((client: any) => ({
      ...client,
      sales: client.sales.map((sale: any) => {
        const totalPaid = sale.installments.reduce((sum: number, inst: any) => {
          if (inst.status === 'pago') {
            return sum + (inst.paidAmount || inst.amount);
          }
          return sum;
        }, 0);

        return {
          ...sale,
          totalPaid,
        };
      }),
    }));
  }

  async update(client: Client, userId?: string): Promise<Client> {
    const where: any = { id: client.id };
    if (userId) where.userId = userId;

    await this.prisma.client.updateMany({
      where,
      data: {
        name: client.name,
        phone: client.phone?.value,
        referredBy: client.referredBy,
        observation: client.observation,
        address: client.address,
        updatedAt: client.updatedAt,
      },
    });

    const fetched = await this.prisma.client.findFirst({ where });
    if (!fetched) throw new Error('Client not found after update');
    return this.toDomain(fetched);
  }

  async delete(id: string, userId?: string): Promise<void> {
    const where: any = { id };
    if (userId) where.userId = userId;

    await this.prisma.client.deleteMany({ where });
  }

  async findByName(name: string, userId?: string): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        name: { contains: name },
        ...(userId ? { userId } : {}),
      },
    });

    return clients.map((client) => this.toDomain(client));
  }

  private toDomain(raw: any): Client {
    return Client.create({
      id: raw.id,
      name: raw.name,
      phone: raw.phone,
      referredBy: raw.referredBy,
      observation: raw.observation,
      address: raw.address,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
