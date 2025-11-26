import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';

// Use Cases
import { CreateCategoryUseCase } from '../../application/category/use-cases/create-category.use-case';
import { FindAllCategoriesUseCase } from '../../application/category/use-cases/find-all-categories.use-case';
import { FindCategoriesWithChildrenUseCase } from '../../application/category/use-cases/find-categories-with-children.use-case';
import { UpdateCategoryUseCase } from '../../application/category/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/category/use-cases/delete-category.use-case';

// Controllers
import { CreateCategoryController } from './controllers/create-category.controller';
import { GetAllCategoriesController } from './controllers/get-all-categories.controller';
import { GetCategoriesHierarchyController } from './controllers/get-categories-hierarchy.controller';
import { UpdateCategoryController } from './controllers/update-category.controller';
import { DeleteCategoryController } from './controllers/delete-category.controller';

@Module({
  controllers: [
    CreateCategoryController,
    GetAllCategoriesController,
    GetCategoriesHierarchyController,
    UpdateCategoryController,
    DeleteCategoryController,
  ],
  providers: [
    PrismaService,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: CreateCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new CreateCategoryUseCase(repo),
      inject: ['ICategoryRepository'],
    },
    {
      provide: FindAllCategoriesUseCase,
      useFactory: (repo: CategoryRepository) => new FindAllCategoriesUseCase(repo),
      inject: ['ICategoryRepository'],
    },
    {
      provide: FindCategoriesWithChildrenUseCase,
      useFactory: (repo: CategoryRepository) => new FindCategoriesWithChildrenUseCase(repo),
      inject: ['ICategoryRepository'],
    },
    {
      provide: UpdateCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new UpdateCategoryUseCase(repo),
      inject: ['ICategoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new DeleteCategoryUseCase(repo),
      inject: ['ICategoryRepository'],
    },
  ],
})
export class CategoryModule {}
