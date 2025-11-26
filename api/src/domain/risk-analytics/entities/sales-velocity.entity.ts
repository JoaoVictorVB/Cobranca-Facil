interface SalesVelocityProps {
  resellerId: string;
  periodDays: number;
  totalRevenue: number;
  dailyAverage: number;
  transactionCount: number;
  calculatedAt: Date;
}

export class SalesVelocity {
  private constructor(private readonly props: SalesVelocityProps) {}

  get resellerId(): string {
    return this.props.resellerId;
  }

  get periodDays(): number {
    return this.props.periodDays;
  }

  get totalRevenue(): number {
    return this.props.totalRevenue;
  }

  get dailyAverage(): number {
    return this.props.dailyAverage;
  }

  get transactionCount(): number {
    return this.props.transactionCount;
  }

  get calculatedAt(): Date {
    return this.props.calculatedAt;
  }

  public static create(props: Omit<SalesVelocityProps, 'calculatedAt'>): SalesVelocity {
    return new SalesVelocity({
      ...props,
      calculatedAt: new Date(),
    });
  }

  public projectRevenue(daysAhead: number): number {
    return this.props.dailyAverage * daysAhead;
  }

  public estimateTimeToReach(targetAmount: number): number {
    if (this.props.dailyAverage <= 0) return Infinity;
    return Math.ceil(targetAmount / this.props.dailyAverage);
  }
}
