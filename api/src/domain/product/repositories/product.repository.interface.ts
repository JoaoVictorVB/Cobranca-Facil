import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(page?: number, limit?: number): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
