import { Inject, Injectable } from '@nestjs/common';
import { StockMovement } from '../../../domain/product/entities/stock-movement.entity';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';

@Injectable()
export class GetStockMovementsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string, userId: string): Promise<StockMovement[]> {
    return await this.productRepository.getStockMovements(productId, userId);
  }
}
