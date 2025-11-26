import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { Category } from '../../../domain/category/entities/category.entity';

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(userId?: string): Promise<Category[]> {
    return await this.categoryRepository.findAll(userId);
  }
}
