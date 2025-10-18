import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../../../domain/common/enums';
import { Installment } from '../../../domain/sale/entities/installment.entity';

export class InstallmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  saleId: string;

  @ApiProperty()
  installmentNumber: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional()
  paidDate?: Date;

  @ApiPropertyOptional()
  paidAmount?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(installment: Installment): InstallmentResponseDto {
    return {
      id: installment.id,
      saleId: installment.saleId,
      installmentNumber: installment.installmentNumber,
      amount: installment.amount.amount,
      dueDate: installment.dueDate,
      status: installment.status,
      paidDate: installment.paidDate,
      paidAmount: installment.paidAmount?.amount,
      createdAt: installment.createdAt,
      updatedAt: installment.updatedAt,
    };
  }
}
