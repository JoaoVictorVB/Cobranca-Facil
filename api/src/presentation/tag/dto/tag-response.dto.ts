import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tag } from '../../../domain/tag/entities/tag.entity';

export class TagResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(tag: Tag): TagResponseDto {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      isActive: tag.isActive,
      createdAt: tag.createdAt!,
      updatedAt: tag.updatedAt!,
    };
  }
}
