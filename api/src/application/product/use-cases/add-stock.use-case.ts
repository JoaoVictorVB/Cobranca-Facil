import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';
import { AdjustStockData } from '../interfaces/product.interfaces';

@Injectable()
export class AddStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: AdjustStockData, userId: string): Promise<Product> {
    return await this.productRepository.addStock(
      input.productId,
      input.quantity,
      userId,
      input.reason,
      input.reference,
    );
  }
}
