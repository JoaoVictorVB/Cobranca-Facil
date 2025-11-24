import { Injectable, NotFoundException } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findById(id, userId);

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.categoryRepository.delete(id, userId);
  }
}
