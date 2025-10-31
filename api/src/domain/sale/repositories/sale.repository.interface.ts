import { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  create(sale: Sale, userId: string): Promise<Sale>;
  findById(id: string, userId?: string): Promise<Sale | null>;
  findAll(userId?: string, page?: number, limit?: number): Promise<Sale[]>;
  findByClientId(clientId: string, userId?: string): Promise<Sale[]>;
  update(sale: Sale, userId?: string): Promise<Sale>;
  delete(id: string, userId?: string): Promise<void>;
}
