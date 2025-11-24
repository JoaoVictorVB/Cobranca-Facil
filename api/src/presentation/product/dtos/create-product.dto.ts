import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Notebook Dell Inspiron',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Notebook Dell Inspiron 15 - Intel Core i7, 16GB RAM, 512GB SSD',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'SKU do produto',
    example: 'NOT-DELL-001',
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({
    description: 'ID da categoria do produto',
    example: 'uuid-da-categoria',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Preço de custo',
    example: 2500.00,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço de venda',
    example: 3500.00,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({
    description: 'Quantidade em estoque',
    example: 10,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Estoque mínimo',
    example: 2,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minStock?: number;

  @ApiPropertyOptional({
    description: 'Estoque máximo',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxStock?: number;

  @ApiPropertyOptional({
    description: 'Unidade de medida',
    example: 'un',
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Código de barras',
    example: '7891234567890',
  })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Localização no estoque',
    example: 'Prateleira A3',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Fornecedor',
    example: 'Dell Brasil',
  })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional({
    description: 'Observações',
    example: 'Produto importado, garantia de 1 ano',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Produto ativo',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
