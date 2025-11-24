import { api } from './api';

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateTagDto {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

const tagService = {
  async create(data: CreateTagDto): Promise<Tag> {
    const response = await api.post<Tag>('/tags', data);
    return response.data;
  },

  async findAll(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  async update(id: string, data: UpdateTagDto): Promise<Tag> {
    const response = await api.patch<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  },
};

export default tagService;
