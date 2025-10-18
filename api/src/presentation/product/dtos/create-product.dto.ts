import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
