import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  create(category: Category, userId: string): Promise<Category>;
  findById(id: string, userId?: string): Promise<Category | null>;
  findAll(userId?: string, includeInactive?: boolean): Promise<Category[]>;
  findByParentId(parentId: string | null, userId?: string): Promise<Category[]>;
  findRootCategories(userId?: string): Promise<Category[]>;
  findSubcategories(parentId: string, userId?: string): Promise<Category[]>;
  findWithChildren(userId?: string): Promise<Category[]>;
  update(category: Category, userId?: string): Promise<Category>;
  delete(id: string, userId?: string): Promise<void>;
  exists(name: string, parentId: string | null, userId: string, excludeId?: string): Promise<boolean>;
}
