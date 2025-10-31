import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(userId?: string): Promise<Product[]> {
    return await this.productRepository.findAll(userId);
  }
}
