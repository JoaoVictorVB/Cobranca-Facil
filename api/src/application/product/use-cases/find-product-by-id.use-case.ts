import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import { ProductNotFoundError } from '../../../domain/product/errors/product.errors';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';

@Injectable()
export class FindProductByIdUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<Product> {
    const product = await this.productRepository.findById(id, userId);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    return product;
  }
}

