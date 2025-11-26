export class Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  parent?: Category;
  children?: Category[];

  constructor(data: {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    isActive: boolean;
    order: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    parent?: Category;
    children?: Category[];
  }) {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Nome da categoria é obrigatório');
    }

    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.parentId = data.parentId;
    this.isActive = data.isActive;
    this.order = data.order;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.parent = data.parent;
    this.children = data.children;
  }

  // Computed properties
  get isSubcategory(): boolean {
    return !!this.parentId;
  }

  get hasChildren(): boolean {
    return !!this.children && this.children.length > 0;
  }

  get fullPath(): string {
    if (this.parent) {
      return `${this.parent.name} > ${this.name}`;
    }
    return this.name;
  }

  // Business logic
  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  updateOrder(newOrder: number): void {
    if (newOrder < 0) {
      throw new Error('Ordem não pode ser negativa');
    }
    this.order = newOrder;
  }
}
