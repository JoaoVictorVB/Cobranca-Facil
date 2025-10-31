import { Client } from '../entities/client.entity';

export interface IClientRepository {
  create(client: Client, userId: string): Promise<Client>;
  findById(id: string, userId?: string): Promise<Client | null>;
  findAll(userId?: string, page?: number, limit?: number): Promise<Client[]>;
  findAllWithSales(userId?: string, page?: number, limit?: number): Promise<any[]>;
  update(client: Client, userId?: string): Promise<Client>;
  delete(id: string, userId?: string): Promise<void>;
  findByName(name: string, userId?: string): Promise<Client[]>;
}
