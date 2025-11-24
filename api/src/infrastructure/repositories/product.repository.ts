import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/entities/product.entity';
import { StockMovement, StockMovementType } from '../../domain/product/entities/stock-movement.entity';
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
        sku: product.sku,
        categoryId: product.categoryId,
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        unit: product.unit,
        barcode: product.barcode,
        location: product.location,
        supplier: product.supplier,
        notes: product.notes,
        isActive: product.isActive,
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

  async findByCategory(categoryId: string, userId?: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
        ...(userId ? { userId } : {}),
      },
      orderBy: { name: 'asc' },
    });

    return products.map((product) => this.toDomain(product));
  }

  async findLowStock(userId?: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        ...(userId ? { userId } : {}),
        stock: {
          lte: this.prisma.product.fields.minStock,
        },
        isActive: true,
      },
      orderBy: { stock: 'asc' },
    });

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
        sku: product.sku,
        categoryId: product.categoryId,
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        unit: product.unit,
        barcode: product.barcode,
        location: product.location,
        supplier: product.supplier,
        notes: product.notes,
        isActive: product.isActive,
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

  async addStock(
    productId: string,
    quantity: number,
    userId: string,
    reason?: string,
    reference?: string,
  ): Promise<Product> {
    const product = await this.findById(productId, userId);
    if (!product) throw new Error('Product not found');

    const previousStock = product.stock;
    product.addStock(quantity);

    const updated = await this.update(product, userId);

    // Criar movimento de estoque
    const movement = StockMovement.create({
      productId,
      type: StockMovementType.ENTRADA,
      quantity,
      previousStock,
      newStock: updated.stock,
      reason,
      reference,
    });

    await this.createStockMovement(movement, userId);

    return updated;
  }

  async removeStock(
    productId: string,
    quantity: number,
    userId: string,
    reason?: string,
    reference?: string,
  ): Promise<Product> {
    const product = await this.findById(productId, userId);
    if (!product) throw new Error('Product not found');

    const previousStock = product.stock;
    product.removeStock(quantity);

    const updated = await this.update(product, userId);

    // Criar movimento de estoque
    const movement = StockMovement.create({
      productId,
      type: StockMovementType.SAIDA,
      quantity: -quantity,
      previousStock,
      newStock: updated.stock,
      reason,
      reference,
    });

    await this.createStockMovement(movement, userId);

    return updated;
  }

  async adjustStock(
    productId: string,
    newQuantity: number,
    userId: string,
    reason?: string,
  ): Promise<Product> {
    const product = await this.findById(productId, userId);
    if (!product) throw new Error('Product not found');

    const previousStock = product.stock;
    product.adjustStock(newQuantity);

    const updated = await this.update(product, userId);

    // Criar movimento de estoque
    const movement = StockMovement.create({
      productId,
      type: StockMovementType.AJUSTE,
      quantity: newQuantity - previousStock,
      previousStock,
      newStock: updated.stock,
      reason,
    });

    await this.createStockMovement(movement, userId);

    return updated;
  }

  async getStockMovements(productId: string, userId?: string): Promise<StockMovement[]> {
    const where: any = { productId };
    if (userId) where.userId = userId;

    const movements = await this.prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((movement) => this.stockMovementToDomain(movement));
  }

  async createStockMovement(movement: StockMovement, userId: string): Promise<StockMovement> {
    const created = await this.prisma.stockMovement.create({
      data: {
        id: movement.id,
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        previousStock: movement.previousStock,
        newStock: movement.newStock,
        reason: movement.reason,
        reference: movement.reference,
        notes: movement.notes,
        userId,
        createdAt: movement.createdAt,
      },
    });

    return this.stockMovementToDomain(created);
  }

  private toDomain(raw: any): Product {
    return Product.create({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      sku: raw.sku,
      category: raw.category,
      costPrice: raw.costPrice,
      salePrice: raw.salePrice,
      stock: raw.stock,
      minStock: raw.minStock,
      maxStock: raw.maxStock,
      unit: raw.unit,
      barcode: raw.barcode,
      location: raw.location,
      supplier: raw.supplier,
      notes: raw.notes,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private stockMovementToDomain(raw: any): StockMovement {
    return StockMovement.create({
      id: raw.id,
      productId: raw.productId,
      type: raw.type as StockMovementType,
      quantity: raw.quantity,
      previousStock: raw.previousStock,
      newStock: raw.newStock,
      reason: raw.reason,
      reference: raw.reference,
      notes: raw.notes,
      createdAt: raw.createdAt,
    });
  }
}
