import { ApiProperty } from '@nestjs/swagger';
import { PaymentFrequency } from '../../../domain/common/enums';
import { Sale } from '../../../domain/sale/entities/sale.entity';

export class SaleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  itemDescription: string;

  @ApiProperty()
  totalValue: number;

  @ApiProperty()
  totalInstallments: number;

  @ApiProperty({ enum: PaymentFrequency })
  paymentFrequency: PaymentFrequency;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  saleDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(sale: Sale): SaleResponseDto {
    return {
      id: sale.id,
      clientId: sale.clientId,
      itemDescription: sale.itemDescription,
      totalValue: sale.totalValue.amount,
      totalInstallments: sale.totalInstallments,
      paymentFrequency: sale.paymentFrequency,
      totalPaid: sale.totalPaid.amount,
      saleDate: sale.saleDate,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
  }
}
