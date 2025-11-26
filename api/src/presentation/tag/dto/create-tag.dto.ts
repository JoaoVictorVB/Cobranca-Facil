import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Prata 925', description: 'Nome da tag' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    example: 'Produtos em prata 925',
    description: 'Descrição da tag',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({
    example: '#3B82F6',
    description: 'Cor em hexadecimal',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Cor deve estar no formato hexadecimal (ex: #3B82F6)',
  })
  color?: string;

  @ApiPropertyOptional({ example: true, description: 'Tag ativa' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
