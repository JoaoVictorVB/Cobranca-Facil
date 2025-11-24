import { randomUUID } from 'crypto';
import { Entity } from '../../common/entity.base';

interface ProductProps {
  name: string;
  description?: string;
  sku?: string;
  categoryId?: string;
  tagIds?: string[];
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
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get sku(): string | undefined {
    return this.props.sku;
  }

  get categoryId(): string | undefined {
    return this.props.categoryId;
  }

  get tagIds(): string[] | undefined {
    return this.props.tagIds;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get salePrice(): number {
    return this.props.salePrice;
  }

  get stock(): number {
    return this.props.stock;
  }

  get minStock(): number {
    return this.props.minStock;
  }

  get maxStock(): number | undefined {
    return this.props.maxStock;
  }

  get unit(): string {
    return this.props.unit;
  }

  get barcode(): string | undefined {
    return this.props.barcode;
  }

  get location(): string | undefined {
    return this.props.location;
  }

  get supplier(): string | undefined {
    return this.props.supplier;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Métodos calculados
  get profitMargin(): number {
    if (this.props.costPrice === 0) return 0;
    return ((this.props.salePrice - this.props.costPrice) / this.props.costPrice) * 100;
  }

  get profitAmount(): number {
    return this.props.salePrice - this.props.costPrice;
  }

  get isLowStock(): boolean {
    return this.props.stock <= this.props.minStock;
  }

  get stockValue(): number {
    return this.props.stock * this.props.costPrice;
  }

  get stockValueSale(): number {
    return this.props.stock * this.props.salePrice;
  }

  protected generateId(): string {
    return randomUUID();
  }

  public static create(props: {
    name: string;
    description?: string;
    sku?: string;
    categoryId?: string;
    category?: string; // Legacy field for backward compatibility
    tagIds?: string[];
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
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
  }): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (props.costPrice !== undefined && props.costPrice < 0) {
      throw new Error('Cost price cannot be negative');
    }

    if (props.salePrice !== undefined && props.salePrice < 0) {
      throw new Error('Sale price cannot be negative');
    }

    if (props.stock !== undefined && props.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    if (props.minStock !== undefined && props.minStock < 0) {
      throw new Error('Min stock cannot be negative');
    }

    const productProps: ProductProps = {
      name: props.name.trim(),
      description: props.description?.trim(),
      sku: props.sku?.trim(),
      categoryId: props.categoryId ?? props.category,
      tagIds: props.tagIds,
      costPrice: props.costPrice ?? 0,
      salePrice: props.salePrice ?? 0,
      stock: props.stock ?? 0,
      minStock: props.minStock ?? 0,
      maxStock: props.maxStock,
      unit: props.unit?.trim() ?? 'un',
      barcode: props.barcode?.trim(),
      location: props.location?.trim(),
      supplier: props.supplier?.trim(),
      notes: props.notes?.trim(),
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new Product(productProps, props.id);
  }

  public update(props: {
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
  }): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error('Product name cannot be empty');
      }
      this.props.name = props.name.trim();
    }

    if (props.description !== undefined) {
      this.props.description = props.description?.trim();
    }

    if (props.sku !== undefined) {
      this.props.sku = props.sku?.trim();
    }

    if (props.categoryId !== undefined) {
      this.props.categoryId = props.categoryId;
    }

    if (props.costPrice !== undefined) {
      if (props.costPrice < 0) {
        throw new Error('Cost price cannot be negative');
      }
      this.props.costPrice = props.costPrice;
    }

    if (props.salePrice !== undefined) {
      if (props.salePrice < 0) {
        throw new Error('Sale price cannot be negative');
      }
      this.props.salePrice = props.salePrice;
    }

    if (props.minStock !== undefined) {
      if (props.minStock < 0) {
        throw new Error('Min stock cannot be negative');
      }
      this.props.minStock = props.minStock;
    }

    if (props.maxStock !== undefined) {
      this.props.maxStock = props.maxStock;
    }

    if (props.unit !== undefined) {
      this.props.unit = props.unit.trim() || 'un';
    }

    if (props.barcode !== undefined) {
      this.props.barcode = props.barcode?.trim();
    }

    if (props.location !== undefined) {
      this.props.location = props.location?.trim();
    }

    if (props.supplier !== undefined) {
      this.props.supplier = props.supplier?.trim();
    }

    if (props.notes !== undefined) {
      this.props.notes = props.notes?.trim();
    }

    if (props.isActive !== undefined) {
      this.props.isActive = props.isActive;
    }

    this.props.updatedAt = new Date();
  }

  public addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    this.props.stock += quantity;
    this.props.updatedAt = new Date();
  }

  public removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (quantity > this.props.stock) {
      throw new Error('Insufficient stock');
    }
    this.props.stock -= quantity;
    this.props.updatedAt = new Date();
  }

  public adjustStock(newQuantity: number): void {
    if (newQuantity < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.props.stock = newQuantity;
    this.props.updatedAt = new Date();
  }
}
