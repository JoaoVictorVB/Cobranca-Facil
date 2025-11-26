import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StockMovement } from '../../../domain/product/entities/stock-movement.entity';

export class StockMovementResponseDto {
  @ApiProperty({
    description: 'ID do movimento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'Tipo de movimento',
    enum: ['entrada', 'saida', 'ajuste', 'venda', 'devolucao'],
    example: 'entrada',
  })
  type: string;

  @ApiProperty({
    description: 'Quantidade movimentada',
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: 'Estoque anterior',
    example: 5,
  })
  previousStock: number;

  @ApiProperty({
    description: 'Estoque após movimento',
    example: 15,
  })
  newStock: number;

  @ApiPropertyOptional({
    description: 'Motivo do movimento',
    example: 'Compra de fornecedor',
  })
  reason?: string;

  @ApiPropertyOptional({
    description: 'Referência',
    example: 'NF-12345',
  })
  reference?: string;

  @ApiPropertyOptional({
    description: 'Observações',
    example: 'Produto em perfeitas condições',
  })
  notes?: string;

  @ApiProperty({
    description: 'Data do movimento',
    example: '2024-01-18T12:00:00.000Z',
  })
  createdAt: Date;

  static fromDomain(movement: StockMovement): StockMovementResponseDto {
    return {
      id: movement.id,
      productId: movement.productId,
      type: movement.type,
      quantity: movement.quantity,
      previousStock: movement.previousStock,
      newStock: movement.newStock,
      reason: movement.reason,
      reference: movement.reference,
      notes: movement.notes,
      createdAt: movement.createdAt,
    };
  }
}
