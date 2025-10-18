import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentFrequency } from '../../../domain/common/enums';

export class CreateSaleRequestDto {
  @ApiProperty({ description: 'Client ID' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Item description' })
  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @ApiProperty({ description: 'Total value of the sale' })
  @IsNumber()
  @IsNotEmpty()
  totalValue: number;

  @ApiProperty({ description: 'Total number of installments' })
  @IsNumber()
  @IsNotEmpty()
  totalInstallments: number;

  @ApiProperty({ enum: PaymentFrequency, description: 'Payment frequency' })
  @IsEnum(PaymentFrequency)
  @IsNotEmpty()
  paymentFrequency: PaymentFrequency;

  @ApiProperty({ description: 'First due date for payment (ISO date string)' })
  @IsDateString()
  @IsNotEmpty()
  firstDueDate: string;

  @ApiPropertyOptional({ description: 'Sale date' })
  @IsDateString()
  @IsOptional()
  saleDate?: string;
}
