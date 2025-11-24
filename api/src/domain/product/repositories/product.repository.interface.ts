import { Product } from '../entities/product.entity';
import { StockMovement } from '../entities/stock-movement.entity';

export interface IProductRepository {
  create(product: Product, userId: string): Promise<Product>;
  findById(id: string, userId?: string): Promise<Product | null>;
  findAll(userId?: string, page?: number, limit?: number): Promise<Product[]>;
  findByCategory(category: string, userId?: string): Promise<Product[]>;
  findLowStock(userId?: string): Promise<Product[]>;
  update(product: Product, userId?: string): Promise<Product>;
  delete(id: string, userId?: string): Promise<void>;
  
  // Stock operations
  addStock(productId: string, quantity: number, userId: string, reason?: string, reference?: string): Promise<Product>;
  removeStock(productId: string, quantity: number, userId: string, reason?: string, reference?: string): Promise<Product>;
  adjustStock(productId: string, newQuantity: number, userId: string, reason?: string): Promise<Product>;
  
  // Stock movements
  getStockMovements(productId: string, userId?: string): Promise<StockMovement[]>;
  createStockMovement(movement: StockMovement, userId: string): Promise<StockMovement>;
}
