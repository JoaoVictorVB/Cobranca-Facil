import { ValueObject } from '../../common/value-object.base';

interface MoneyProps {
  amount: number;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  get amount(): number {
    return this.props.amount;
  }

  public static create(amount: number): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    return new Money({ amount: Math.round(amount * 100) / 100 });
  }

  public add(money: Money): Money {
    return Money.create(this.amount + money.amount);
  }

  public subtract(money: Money): Money {
    return Money.create(this.amount - money.amount);
  }

  public multiply(factor: number): Money {
    return Money.create(this.amount * factor);
  }

  public divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return Money.create(this.amount / divisor);
  }

  public isGreaterThan(money: Money): boolean {
    return this.amount > money.amount;
  }

  public isLessThan(money: Money): boolean {
    return this.amount < money.amount;
  }

  public format(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.amount);
  }
}
