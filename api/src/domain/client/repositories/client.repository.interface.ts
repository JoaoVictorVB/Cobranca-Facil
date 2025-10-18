import { Client } from '../entities/client.entity';

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findAll(page?: number, limit?: number): Promise<Client[]>;
  findAllWithSales(page?: number, limit?: number): Promise<any[]>;
  update(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Client[]>;
}
