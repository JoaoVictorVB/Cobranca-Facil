import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../../domain/product/errors/product.errors';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<void> {
    const product = await this.productRepository.findById(id, userId);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    await this.productRepository.delete(id, userId);
  }
}

