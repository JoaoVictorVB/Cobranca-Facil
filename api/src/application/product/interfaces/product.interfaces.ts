export interface CreateProductData {
  name: string;
  description?: string;
}

export interface UpdateProductData {
  id: string;
  name?: string;
  description?: string;
}
