import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Notebook Dell Inspiron',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Notebook Dell Inspiron 15 - Intel Core i7, 16GB RAM, 512GB SSD',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
