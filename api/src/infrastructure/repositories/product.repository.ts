import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/entities/product.entity';
import { IProductRepository } from '../../domain/product/repositories/product.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product, userId: string): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        userId: userId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string, userId?: string): Promise<Product | null> {
    const where: any = { id };
    if (userId) where.userId = userId;

    const product = await this.prisma.product.findFirst({
      where,
    });

    return product ? this.toDomain(product) : null;
  }

  async findAll(userId?: string, page?: number, limit?: number): Promise<Product[]> {
    const query: any = {
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const products = await this.prisma.product.findMany(query);

    return products.map((product) => this.toDomain(product));
  }

  async update(product: Product, userId?: string): Promise<Product> {
    const where: any = { id: product.id };
    if (userId) where.userId = userId;

    await this.prisma.product.updateMany({
      where,
      data: {
        name: product.name,
        description: product.description,
        updatedAt: product.updatedAt,
      },
    });

    const fetched = await this.prisma.product.findFirst({ where });
    if (!fetched) throw new Error('Product not found after update');
    return this.toDomain(fetched);
  }

  async delete(id: string, userId?: string): Promise<void> {
    const where: any = { id };
    if (userId) where.userId = userId;

    await this.prisma.product.deleteMany({ where });
  }

  private toDomain(raw: any): Product {
    return Product.create({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
