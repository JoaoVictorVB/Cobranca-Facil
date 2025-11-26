import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';
import { StockAdjustmentData } from '../interfaces/product.interfaces';

@Injectable()
export class AdjustStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: StockAdjustmentData, userId: string): Promise<Product> {
    return await this.productRepository.adjustStock(
      input.productId,
      input.newQuantity,
      userId,
      input.reason,
    );
  }
}
