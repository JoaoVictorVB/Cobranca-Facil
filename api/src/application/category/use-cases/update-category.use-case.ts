import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { Category } from '../../../domain/category/entities/category.entity';

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  order?: number;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: UpdateCategoryRequest, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findById(request.id, userId);

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Check for name conflicts if name is being changed
    if (request.name && request.name !== category.name) {
      const parentIdToCheck = request.parentId !== undefined ? (request.parentId || null) : (category.parentId || null);
      const exists = await this.categoryRepository.exists(
        request.name,
        parentIdToCheck,
        userId,
        category.id
      );

      if (exists) {
        throw new ConflictException('Já existe uma categoria com este nome');
      }
    }

    // Update properties
    if (request.name) category.name = request.name;
    if (request.description !== undefined) category.description = request.description;
    if (request.parentId !== undefined) category.parentId = request.parentId;
    if (request.isActive !== undefined) category.isActive = request.isActive;
    if (request.order !== undefined) category.updateOrder(request.order);

    return await this.categoryRepository.update(category, userId);
  }
}
