import { api } from './api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  categoryId?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  barcode?: string;
  location?: string;
  supplier?: string;
  notes?: string;
  isActive: boolean;
  profitMargin: number;
  profitAmount: number;
  isLowStock: boolean;
  stockValue: number;
  stockValueSale: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  sku?: string;
  categoryId?: string;
  costPrice?: number;
  salePrice?: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  barcode?: string;
  location?: string;
  supplier?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  sku?: string;
  categoryId?: string;
  costPrice?: number;
  salePrice?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  barcode?: string;
  location?: string;
  supplier?: string;
  notes?: string;
  isActive?: boolean;
}

export interface AdjustStockDto {
  quantity: number;
  reason?: string;
  reference?: string;
}

export interface StockAdjustmentDto {
  newQuantity: number;
  reason?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'entrada' | 'saida' | 'ajuste' | 'venda' | 'devolucao';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export const productService = {
  async create(data: CreateProductDto): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async findAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async findById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async findLowStock(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/low-stock');
    return response.data;
  },

  async addStock(id: string, data: AdjustStockDto): Promise<Product> {
    const response = await api.post<Product>(`/products/${id}/stock/add`, data);
    return response.data;
  },

  async removeStock(id: string, data: AdjustStockDto): Promise<Product> {
    const response = await api.post<Product>(`/products/${id}/stock/remove`, data);
    return response.data;
  },

  async adjustStock(id: string, data: StockAdjustmentDto): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}/stock/adjust`, data);
    return response.data;
  },

  async getStockMovements(id: string): Promise<StockMovement[]> {
    const response = await api.get<StockMovement[]>(`/products/${id}/stock/movements`);
    return response.data;
  },
};
