import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

class TransferItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity to transfer', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class SendMerchandiseRequestDto {
  @ApiProperty({ description: 'Reseller user ID' })
  @IsUUID()
  @IsNotEmpty()
  resellerId: string;

  @ApiProperty({ description: 'Items to transfer', type: [TransferItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[];

  @ApiProperty({ description: 'Optional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
