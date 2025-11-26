import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../../domain/category/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  parent?: CategoryResponseDto;

  @ApiPropertyOptional({ type: [CategoryResponseDto] })
  children?: CategoryResponseDto[];

  @ApiProperty()
  isSubcategory: boolean;

  @ApiProperty()
  hasChildren: boolean;

  @ApiProperty()
  fullPath: string;

  static fromDomain(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      parent: category.parent ? this.fromDomainSimple(category.parent) : undefined,
      children: category.children?.map((child) => this.fromDomainSimple(child)),
      isSubcategory: category.isSubcategory,
      hasChildren: category.hasChildren,
      fullPath: category.fullPath,
    };
  }

  static fromDomainSimple(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      isSubcategory: category.isSubcategory,
      hasChildren: category.hasChildren,
      fullPath: category.fullPath,
    };
  }
}
