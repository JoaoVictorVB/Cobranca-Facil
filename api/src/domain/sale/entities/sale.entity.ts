import { randomUUID } from 'crypto';
import { Entity } from '../../common/entity.base';
import { PaymentFrequency } from '../../common/enums';
import { Money } from '../value-objects/money.vo';

interface SaleProps {
  clientId: string;
  itemDescription: string;
  totalValue: Money;
  totalInstallments: number;
  paymentFrequency: PaymentFrequency;
  firstDueDate: Date;
  totalPaid: Money;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Sale extends Entity<SaleProps> {
  private constructor(props: SaleProps, id?: string) {
    super(props, id);
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get itemDescription(): string {
    return this.props.itemDescription;
  }

  get totalValue(): Money {
    return this.props.totalValue;
  }

  get totalInstallments(): number {
    return this.props.totalInstallments;
  }

  get paymentFrequency(): PaymentFrequency {
    return this.props.paymentFrequency;
  }

  get firstDueDate(): Date {
    return this.props.firstDueDate;
  }

  get totalPaid(): Money {
    return this.props.totalPaid;
  }

  get saleDate(): Date {
    return this.props.saleDate;
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
    clientId: string;
    itemDescription: string;
    totalValue: number;
    totalInstallments: number;
    paymentFrequency: PaymentFrequency;
    firstDueDate: Date;
    totalPaid?: number;
    saleDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
  }): Sale {
    if (!props.clientId) {
      throw new Error('Client ID is required');
    }

    if (!props.itemDescription || props.itemDescription.trim().length === 0) {
      throw new Error('Item description is required');
    }

    if (props.totalInstallments <= 0) {
      throw new Error('Total installments must be greater than 0');
    }

    if (!props.firstDueDate || !(props.firstDueDate instanceof Date)) {
      throw new Error('First due date is required and must be a valid date');
    }

    const saleProps: SaleProps = {
      clientId: props.clientId,
      itemDescription: props.itemDescription.trim(),
      totalValue: Money.create(props.totalValue),
      totalInstallments: props.totalInstallments,
      paymentFrequency: props.paymentFrequency,
      firstDueDate: props.firstDueDate,
      totalPaid: Money.create(props.totalPaid || 0),
      saleDate: props.saleDate || new Date(),
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new Sale(saleProps, props.id);
  }

  public calculateInstallmentValue(): Money {
    return this.props.totalValue.divide(this.props.totalInstallments);
  }

  public addPayment(amount: number): void {
    const payment = Money.create(amount);
    this.props.totalPaid = this.props.totalPaid.add(payment);
    this.props.updatedAt = new Date();
  }

  public removePayment(amount: number): void {
    const payment = Money.create(amount);
    this.props.totalPaid = this.props.totalPaid.subtract(payment);
    this.props.updatedAt = new Date();
  }

  public getRemainingBalance(): Money {
    return this.props.totalValue.subtract(this.props.totalPaid);
  }

  public isFullyPaid(): boolean {
    return this.getRemainingBalance().amount <= 0;
  }
}
