import { Injectable } from '@nestjs/common';
import { Client } from '../../domain/client/entities/client.entity';
import { IClientRepository } from '../../domain/client/repositories/client.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(client: Client): Promise<Client> {
    const created = await this.prisma.client.create({
      data: {
        id: client.id,
        name: client.name,
        phone: client.phone?.value,
        referredBy: client.referredBy,
        observation: client.observation,
        address: client.address,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    return client ? this.toDomain(client) : null;
  }

  async findAll(page: number = 1, limit: number = 50): Promise<Client[]> {
    const skip = (page - 1) * limit;
    const clients = await this.prisma.client.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return clients.map((client) => this.toDomain(client));
  }

  async findAllWithSales(page: number = 1, limit: number = 50): Promise<any[]> {
    const skip = (page - 1) * limit;
    const clients = await this.prisma.client.findMany({
      skip,
      take: limit,
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
    });

    // Calcular totalPaid para cada sale
    return clients.map((client) => ({
      ...client,
      sales: client.sales.map((sale) => {
        const totalPaid = sale.installments.reduce((sum, inst) => {
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

  async update(client: Client): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id: client.id },
      data: {
        name: client.name,
        phone: client.phone?.value,
        referredBy: client.referredBy,
        observation: client.observation,
        address: client.address,
        updatedAt: client.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        name: {
          contains: name,
        },
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
