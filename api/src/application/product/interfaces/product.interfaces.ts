export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string;
  category?: string;
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

export interface UpdateProductData {
  id: string;
  name?: string;
  description?: string;
  sku?: string;
  category?: string;
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

export interface AdjustStockData {
  productId: string;
  quantity: number;
  reason?: string;
  reference?: string;
}

export interface StockAdjustmentData {
  productId: string;
  newQuantity: number;
  reason?: string;
}
