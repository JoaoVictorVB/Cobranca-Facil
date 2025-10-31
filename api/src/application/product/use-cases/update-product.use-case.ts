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

    if (input.name && input.name !== product.name) {
      const existingProducts = await this.productRepository.findAll(userId);
      const nameExists = existingProducts.some(
        (p) => p.name.toLowerCase() === input.name!.toLowerCase() && p.id !== input.id,
      );

      if (nameExists) {
        throw new ProductAlreadyExistsError(input.name);
      }
    }

    product.update({
      name: input.name,
      description: input.description,
    });

    return await this.productRepository.update(product, userId);
  }
}
