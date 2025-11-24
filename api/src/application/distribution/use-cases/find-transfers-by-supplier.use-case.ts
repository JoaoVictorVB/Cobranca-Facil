import { Inject, Injectable } from '@nestjs/common';
import { StockTransfer } from '../../../domain/distribution/entities/stock-transfer.entity';
import {
    IStockTransferRepository,
    STOCK_TRANSFER_REPOSITORY,
} from '../../../domain/distribution/repositories/stock-transfer.repository.interface';

@Injectable()
export class FindTransfersBySupplierUseCase {
  constructor(
    @Inject(STOCK_TRANSFER_REPOSITORY)
    private readonly repository: IStockTransferRepository,
  ) {}

  async execute(supplierId: string): Promise<StockTransfer[]> {
    return await this.repository.findBySupplier(supplierId);
  }
}
