import { randomUUID } from 'crypto';
import { Entity } from '../../common/entity.base';
import { PaymentStatus } from '../../common/enums';
import { Money } from '../value-objects/money.vo';

interface InstallmentProps {
  saleId: string;
  installmentNumber: number;
  amount: Money;
  dueDate: Date;
  status: PaymentStatus;
  paidDate?: Date;
  paidAmount?: Money;
  createdAt: Date;
  updatedAt: Date;
}

export class Installment extends Entity<InstallmentProps> {
  private constructor(props: InstallmentProps, id?: string) {
    super(props, id);
  }

  get saleId(): string {
    return this.props.saleId;
  }

  get installmentNumber(): number {
    return this.props.installmentNumber;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get paidDate(): Date | undefined {
    return this.props.paidDate;
  }

  get paidAmount(): Money | undefined {
    return this.props.paidAmount;
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
    saleId: string;
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    status?: PaymentStatus;
    paidDate?: Date;
    paidAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
  }): Installment {
    if (!props.saleId) {
      throw new Error('Sale ID is required');
    }

    if (props.installmentNumber <= 0) {
      throw new Error('Installment number must be greater than 0');
    }

    const installmentProps: InstallmentProps = {
      saleId: props.saleId,
      installmentNumber: props.installmentNumber,
      amount: Money.create(props.amount),
      dueDate: props.dueDate,
      status: props.status || PaymentStatus.PENDENTE,
      paidDate: props.paidDate,
      paidAmount: props.paidAmount ? Money.create(props.paidAmount) : undefined,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new Installment(installmentProps, props.id);
  }

  public markAsPaid(amount: number, paidDate?: Date): void {
    const payment = Money.create(amount);

    if (payment.isLessThan(this.props.amount)) {
      this.props.paidAmount = payment;
      this.props.paidDate = paidDate || new Date();
      if (this.isOverdue()) {
        this.props.status = PaymentStatus.ATRASADO;
      } else {
        this.props.status = PaymentStatus.PENDENTE;
      }
    } else {
      this.props.status = PaymentStatus.PAGO;
      this.props.paidAmount = payment;
      this.props.paidDate = paidDate || new Date();
    }
    
    this.props.updatedAt = new Date();
  }

  public markAsOverdue(): void {
    if (this.props.status === PaymentStatus.PENDENTE && this.isOverdue()) {
      this.props.status = PaymentStatus.ATRASADO;
      this.props.updatedAt = new Date();
    }
  }

  public isOverdue(): boolean {
    return this.props.dueDate < new Date() && this.props.status !== PaymentStatus.PAGO;
  }

  public isPaid(): boolean {
    return this.props.status === PaymentStatus.PAGO;
  }
}
