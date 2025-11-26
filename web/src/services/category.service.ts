import { api } from './api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category;
  children?: Category[];
  isSubcategory: boolean;
  hasChildren: boolean;
  fullPath: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  order?: number;
}

class CategoryService {
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  }

  async findAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  }

  async findHierarchy(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories/hierarchy');
    return response.data;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
