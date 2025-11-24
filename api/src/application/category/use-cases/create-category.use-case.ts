import { Injectable, ConflictException } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { Category } from '../../../domain/category/entities/category.entity';
import { randomUUID } from 'crypto';

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  order?: number;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: CreateCategoryRequest, userId: string): Promise<Category> {
    // Check if category with same name and parent already exists
    const exists = await this.categoryRepository.exists(
      request.name,
      request.parentId || null,
      userId
    );

    if (exists) {
      throw new ConflictException(
        request.parentId
          ? 'Já existe uma subcategoria com este nome'
          : 'Já existe uma categoria com este nome'
      );
    }

    const category = new Category({
      id: randomUUID(),
      name: request.name,
      description: request.description,
      parentId: request.parentId,
      isActive: request.isActive ?? true,
      order: request.order ?? 0,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.categoryRepository.create(category, userId);
  }
}
