import { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  create(sale: Sale): Promise<Sale>;
  findById(id: string): Promise<Sale | null>;
  findAll(page?: number, limit?: number): Promise<Sale[]>;
  findByClientId(clientId: string): Promise<Sale[]>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
}
