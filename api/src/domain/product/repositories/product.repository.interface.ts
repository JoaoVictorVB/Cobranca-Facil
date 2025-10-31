import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Product, userId: string): Promise<Product>;
  findById(id: string, userId?: string): Promise<Product | null>;
  findAll(userId?: string, page?: number, limit?: number): Promise<Product[]>;
  update(product: Product, userId?: string): Promise<Product>;
  delete(id: string, userId?: string): Promise<void>;
}
