import { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  create(sale: Sale, userId: string): Promise<Sale>;
  findById(id: string, userId?: string): Promise<Sale | null>;
  findAll(page?: number, limit?: number, userId?: string): Promise<Sale[]>;
  findByClientId(clientId: string, userId?: string): Promise<Sale[]>;
  update(sale: Sale, userId?: string): Promise<Sale>;
  delete(id: string, userId?: string): Promise<void>;
}
