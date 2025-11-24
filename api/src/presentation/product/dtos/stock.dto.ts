import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({
    description: 'Quantidade a ser adicionada ou removida',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({
    description: 'Motivo do ajuste',
    example: 'Compra de fornecedor',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Referência (nota fiscal, pedido, etc)',
    example: 'NF-12345',
  })
  @IsString()
  @IsOptional()
  reference?: string;
}

export class StockAdjustmentDto {
  @ApiProperty({
    description: 'Nova quantidade em estoque',
    example: 25,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  newQuantity: number;

  @ApiPropertyOptional({
    description: 'Motivo do ajuste',
    example: 'Inventário - contagem física',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
