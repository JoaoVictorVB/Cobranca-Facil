import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/entities/product.entity';
import { IProductRepository } from '../../domain/product/repositories/product.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? this.toDomain(product) : null;
  }

  async findAll(page: number = 1, limit: number = 50): Promise<Product[]> {
    const skip = (page - 1) * limit;
    const products = await this.prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => this.toDomain(product));
  }

  async update(product: Product): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        updatedAt: product.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
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
