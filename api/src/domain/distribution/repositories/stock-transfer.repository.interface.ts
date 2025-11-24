import { StockTransfer } from '../entities/stock-transfer.entity';

export const STOCK_TRANSFER_REPOSITORY = 'STOCK_TRANSFER_REPOSITORY';

export interface IStockTransferRepository {
  create(transfer: StockTransfer): Promise<StockTransfer>;
  findById(id: string): Promise<StockTransfer | null>;
  findBySupplier(supplierId: string): Promise<StockTransfer[]>;
  findByReseller(resellerId: string): Promise<StockTransfer[]>;
  findPendingByReseller(resellerId: string): Promise<StockTransfer[]>;
  update(transfer: StockTransfer): Promise<StockTransfer>;
  delete(id: string): Promise<void>;
}
