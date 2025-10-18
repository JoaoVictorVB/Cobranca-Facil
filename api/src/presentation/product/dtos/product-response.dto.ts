import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../../../domain/product/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Notebook Dell Inspiron',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Notebook Dell Inspiron 15 - Intel Core i7, 16GB RAM, 512GB SSD',
  })
  description?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-18T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-18T12:00:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
