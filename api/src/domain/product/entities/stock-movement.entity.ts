import { randomUUID } from 'crypto';
import { Entity } from '../../common/entity.base';

export enum StockMovementType {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
  AJUSTE = 'ajuste',
  VENDA = 'venda',
  DEVOLUCAO = 'devolucao',
}

interface StockMovementProps {
  productId: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export class StockMovement extends Entity<StockMovementProps> {
  private constructor(props: StockMovementProps, id?: string) {
    super(props, id);
  }

  get productId(): string {
    return this.props.productId;
  }

  get type(): StockMovementType {
    return this.props.type;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get previousStock(): number {
    return this.props.previousStock;
  }

  get newStock(): number {
    return this.props.newStock;
  }

  get reason(): string | undefined {
    return this.props.reason;
  }

  get reference(): string | undefined {
    return this.props.reference;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  protected generateId(): string {
    return randomUUID();
  }

  public static create(props: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    reference?: string;
    notes?: string;
    createdAt?: Date;
    id?: string;
  }): StockMovement {
    if (!props.productId) {
      throw new Error('Product ID is required');
    }

    if (props.quantity === 0) {
      throw new Error('Quantity cannot be zero');
    }

    const movementProps: StockMovementProps = {
      productId: props.productId,
      type: props.type,
      quantity: props.quantity,
      previousStock: props.previousStock,
      newStock: props.newStock,
      reason: props.reason?.trim(),
      reference: props.reference?.trim(),
      notes: props.notes?.trim(),
      createdAt: props.createdAt || new Date(),
    };

    return new StockMovement(movementProps, props.id);
  }
}
