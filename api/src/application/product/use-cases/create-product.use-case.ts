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
    const existingProducts = await this.productRepository.findAll(undefined, undefined, userId);
    const productExists = existingProducts.some(
      (p) => p.name.toLowerCase() === input.name.toLowerCase(),
    );

    if (productExists) {
      throw new ProductAlreadyExistsError(input.name);
    }

    const product = Product.create({
      name: input.name,
      description: input.description,
    });

    return await this.productRepository.create(product, userId);
  }
}

