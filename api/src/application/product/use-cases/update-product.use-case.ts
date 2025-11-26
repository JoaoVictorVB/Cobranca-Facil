import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import {
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from '../../../domain/product/errors/product.errors';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';
import { UpdateProductData } from '../interfaces/product.interfaces';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: UpdateProductData, userId?: string): Promise<Product> {
    const product = await this.productRepository.findById(input.id, userId);

    if (!product) {
      throw new ProductNotFoundError(input.id);
    }

    // Verificar SKU duplicado
    if (input.sku && input.sku !== product.sku) {
      const existingProducts = await this.productRepository.findAll(userId);
      const skuExists = existingProducts.some(
        (p) => p.sku && p.sku.toLowerCase() === input.sku!.toLowerCase() && p.id !== input.id,
      );

      if (skuExists) {
        throw new ProductAlreadyExistsError(`SKU ${input.sku}`);
      }
    }

    product.update({
      name: input.name,
      description: input.description,
      sku: input.sku,
      categoryId: input.categoryId,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      minStock: input.minStock,
      maxStock: input.maxStock,
      unit: input.unit,
      barcode: input.barcode,
      location: input.location,
      supplier: input.supplier,
      notes: input.notes,
      isActive: input.isActive,
    });

    return await this.productRepository.update(product, userId, input.tagIds);
  }
}
