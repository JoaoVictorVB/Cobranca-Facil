import { ApiProperty } from '@nestjs/swagger';
import { TransferStatus } from '../../../domain/distribution/entities/stock-transfer.entity';

class TransferItemResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  salePrice: number;
}

export class StockTransferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  supplierId: string;

  @ApiProperty()
  resellerId: string;

  @ApiProperty({ enum: TransferStatus })
  status: TransferStatus;

  @ApiProperty({ type: [TransferItemResponseDto] })
  items: TransferItemResponseDto[];

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  sentAt: Date;

  @ApiProperty({ required: false })
  receivedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalValue: number;

  static fromDomain(transfer: any): StockTransferResponseDto {
    return {
      id: transfer.id,
      supplierId: transfer.supplierId,
      resellerId: transfer.resellerId,
      status: transfer.status,
      items: transfer.items,
      notes: transfer.notes,
      sentAt: transfer.sentAt,
      receivedAt: transfer.receivedAt,
      createdAt: transfer.createdAt,
      totalQuantity: transfer.getTotalQuantity(),
      totalValue: transfer.getTotalValue(),
    };
  }
}
