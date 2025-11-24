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

  @ApiPropertyOptional({
    description: 'SKU do produto',
    example: 'NOT-DELL-001',
  })
  sku?: string;

  @ApiPropertyOptional({
    description: 'ID da categoria do produto',
    example: 'uuid-da-categoria',
  })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'IDs das tags do produto',
    example: ['uuid-da-tag-1', 'uuid-da-tag-2'],
    type: [String],
  })
  tagIds?: string[];

  @ApiProperty({
    description: 'Preço de custo',
    example: 2500.00,
  })
  costPrice: number;

  @ApiProperty({
    description: 'Preço de venda',
    example: 3500.00,
  })
  salePrice: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 10,
  })
  stock: number;

  @ApiProperty({
    description: 'Estoque mínimo',
    example: 2,
  })
  minStock: number;

  @ApiPropertyOptional({
    description: 'Estoque máximo',
    example: 50,
  })
  maxStock?: number;

  @ApiProperty({
    description: 'Unidade de medida',
    example: 'un',
  })
  unit: string;

  @ApiPropertyOptional({
    description: 'Código de barras',
    example: '7891234567890',
  })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Localização no estoque',
    example: 'Prateleira A3',
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'Fornecedor',
    example: 'Dell Brasil',
  })
  supplier?: string;

  @ApiPropertyOptional({
    description: 'Observações',
    example: 'Produto importado, garantia de 1 ano',
  })
  notes?: string;

  @ApiProperty({
    description: 'Produto ativo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Margem de lucro (%)',
    example: 40.00,
  })
  profitMargin: number;

  @ApiProperty({
    description: 'Lucro por unidade',
    example: 1000.00,
  })
  profitAmount: number;

  @ApiProperty({
    description: 'Estoque baixo',
    example: false,
  })
  isLowStock: boolean;

  @ApiProperty({
    description: 'Valor total em estoque (custo)',
    example: 25000.00,
  })
  stockValue: number;

  @ApiProperty({
    description: 'Valor total em estoque (venda)',
    example: 35000.00,
  })
  stockValueSale: number;

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
      sku: product.sku,
      categoryId: product.categoryId,
      tagIds: product.tagIds,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      barcode: product.barcode,
      location: product.location,
      supplier: product.supplier,
      notes: product.notes,
      isActive: product.isActive,
      profitMargin: product.profitMargin,
      profitAmount: product.profitAmount,
      isLowStock: product.isLowStock,
      stockValue: product.stockValue,
      stockValueSale: product.stockValueSale,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
