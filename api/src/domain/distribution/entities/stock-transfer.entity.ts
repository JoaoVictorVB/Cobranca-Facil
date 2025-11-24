export enum TransferStatus {
  ENVIADO = 'ENVIADO',
  RECEBIDO = 'RECEBIDO',
  DEVOLVIDO = 'DEVOLVIDO',
  CANCELADO = 'CANCELADO',
}

export interface TransferItem {
  productId: string;
  quantity: number;
  name: string;
  costPrice: number;
  salePrice: number;
}

export interface StockTransferProps {
  id: string;
  supplierId: string;
  resellerId: string;
  status: TransferStatus;
  items: TransferItem[];
  notes?: string;
  sentAt: Date;
  receivedAt?: Date;
  createdAt: Date;
}

export class StockTransfer {
  private constructor(private readonly props: StockTransferProps) {}

  static create(
    supplierId: string,
    resellerId: string,
    items: TransferItem[],
    notes?: string,
  ): StockTransfer {
    if (items.length === 0) {
      throw new Error('Transfer must have at least one item');
    }

    return new StockTransfer({
      id: crypto.randomUUID(),
      supplierId,
      resellerId,
      status: TransferStatus.ENVIADO,
      items,
      notes,
      sentAt: new Date(),
      createdAt: new Date(),
    });
  }

  static reconstitute(props: StockTransferProps): StockTransfer {
    return new StockTransfer(props);
  }

  markAsReceived(): void {
    if (this.props.status !== TransferStatus.ENVIADO) {
      throw new Error('Only sent transfers can be received');
    }
    this.props.status = TransferStatus.RECEBIDO;
    this.props.receivedAt = new Date();
  }

  markAsReturned(): void {
    if (this.props.status === TransferStatus.CANCELADO) {
      throw new Error('Cannot return a cancelled transfer');
    }
    this.props.status = TransferStatus.DEVOLVIDO;
  }

  cancel(): void {
    if (this.props.status === TransferStatus.RECEBIDO) {
      throw new Error('Cannot cancel a received transfer');
    }
    this.props.status = TransferStatus.CANCELADO;
  }

  get id(): string {
    return this.props.id;
  }

  get supplierId(): string {
    return this.props.supplierId;
  }

  get resellerId(): string {
    return this.props.resellerId;
  }

  get status(): TransferStatus {
    return this.props.status;
  }

  get items(): TransferItem[] {
    return this.props.items;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get sentAt(): Date {
    return this.props.sentAt;
  }

  get receivedAt(): Date | undefined {
    return this.props.receivedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  getTotalQuantity(): number {
    return this.props.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalValue(): number {
    return this.props.items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0);
  }
}
