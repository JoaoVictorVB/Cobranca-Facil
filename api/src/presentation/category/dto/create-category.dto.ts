import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Eletrônicos', description: 'Nome da categoria' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Produtos eletrônicos diversos', description: 'Descrição da categoria' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-da-categoria-pai', description: 'ID da categoria pai (para subcategorias)' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: true, description: 'Se a categoria está ativa' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Ordem de exibição' })
  @IsNumber()
  @IsOptional()
  order?: number;
}
