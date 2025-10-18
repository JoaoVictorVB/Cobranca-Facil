import { randomUUID } from 'crypto';
import { Entity } from '../../common/entity.base';

interface ProductProps {
  name: string;
  description?: string;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  protected generateId(): string {
    return randomUUID();
  }

  public static create(props: {
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
  }): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    const productProps: ProductProps = {
      name: props.name.trim(),
      description: props.description?.trim(),
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new Product(productProps, props.id);
  }

  public update(props: { name?: string; description?: string }): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error('Product name cannot be empty');
      }
      this.props.name = props.name.trim();
    }

    if (props.description !== undefined) {
      this.props.description = props.description?.trim();
    }

    this.props.updatedAt = new Date();
  }
}
