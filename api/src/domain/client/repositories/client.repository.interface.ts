import { Client } from '../entities/client.entity';

export interface IClientRepository {
  create(client: Client, userId: string): Promise<Client>;
  findById(id: string, userId?: string): Promise<Client | null>;
  findAll(page?: number, limit?: number, userId?: string): Promise<Client[]>;
  findAllWithSales(page?: number, limit?: number, userId?: string): Promise<any[]>;
  update(client: Client, userId?: string): Promise<Client>;
  delete(id: string, userId?: string): Promise<void>;
  findByName(name: string, userId?: string): Promise<Client[]>;
}
