import { api } from './api';

export interface Client {
  id: string;
  name: string;
  phone?: string;
  referredBy?: string;
  observation?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDto {
  name: string;
  phone?: string;
  referredBy?: string;
  observation?: string;
  address?: string;
}

export interface UpdateClientDto {
  name?: string;
  phone?: string;
  referredBy?: string;
  observation?: string;
  address?: string;
}

export const clientService = {
  async create(data: CreateClientDto): Promise<Client> {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  async findAll(): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  },

  async findById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
