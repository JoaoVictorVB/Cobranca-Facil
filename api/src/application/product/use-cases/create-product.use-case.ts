import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import { ProductAlreadyExistsError } from '../../../domain/product/errors/product.errors';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';
import { CreateProductData } from '../interfaces/product.interfaces';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: CreateProductData, userId: string): Promise<Product> {
    // Verificar se SKU já existe
    if (input.sku) {
      const existingProducts = await this.productRepository.findAll(userId);
      const skuExists = existingProducts.some(
        (p) => p.sku && p.sku.toLowerCase() === input.sku!.toLowerCase(),
      );

      if (skuExists) {
        throw new ProductAlreadyExistsError(`SKU ${input.sku}`);
      }
    }

    const product = Product.create({
      name: input.name,
      description: input.description,
      sku: input.sku,
      category: input.category,
      tagIds: input.tagIds,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      stock: input.stock,
      minStock: input.minStock,
      maxStock: input.maxStock,
      unit: input.unit,
      barcode: input.barcode,
      location: input.location,
      supplier: input.supplier,
      notes: input.notes,
      isActive: input.isActive,
    });

    return await this.productRepository.create(product, userId, input.tagIds);
  }
}
