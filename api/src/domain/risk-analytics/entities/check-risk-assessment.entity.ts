export enum RiskLevel {
  BAIXO = 'BAIXO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
}

interface CheckRiskAssessmentProps {
  resellerId: string;
  checkAmount: number;
  checkDate: Date;
  riskLevel: RiskLevel;
  currentBalance: number;
  projectedRevenue: number;
  stockValue: number;
  daysUntilCheck: number;
  availableFunds: number;
  recommendation: string;
  assessedAt: Date;
}

export class CheckRiskAssessment {
  private constructor(private readonly props: CheckRiskAssessmentProps) {}

  get resellerId(): string {
    return this.props.resellerId;
  }

  get checkAmount(): number {
    return this.props.checkAmount;
  }

  get checkDate(): Date {
    return this.props.checkDate;
  }

  get riskLevel(): RiskLevel {
    return this.props.riskLevel;
  }

  get currentBalance(): number {
    return this.props.currentBalance;
  }

  get projectedRevenue(): number {
    return this.props.projectedRevenue;
  }

  get stockValue(): number {
    return this.props.stockValue;
  }

  get daysUntilCheck(): number {
    return this.props.daysUntilCheck;
  }

  get availableFunds(): number {
    return this.props.availableFunds;
  }

  get recommendation(): string {
    return this.props.recommendation;
  }

  get assessedAt(): Date {
    return this.props.assessedAt;
  }

  public static create(
    props: Omit<
      CheckRiskAssessmentProps,
      'assessedAt' | 'availableFunds' | 'riskLevel' | 'recommendation'
    >,
  ): CheckRiskAssessment {
    const availableFunds = props.currentBalance + props.projectedRevenue;

    let riskLevel: RiskLevel;
    let recommendation: string;

    if (availableFunds >= props.checkAmount * 1.2) {
      riskLevel = RiskLevel.BAIXO;
      recommendation = 'Seguro aceitar - margem de 20%+ disponível';
    } else if (availableFunds >= props.checkAmount) {
      riskLevel = RiskLevel.MEDIO;
      recommendation = 'Aceitar com atenção - margem apertada';
    } else {
      riskLevel = RiskLevel.ALTO;
      const deficit = props.checkAmount - availableFunds;
      recommendation = `Risco elevado - faltam R$ ${deficit.toFixed(2)}. Negociar prazo maior ou solicitar garantias`;
    }

    return new CheckRiskAssessment({
      ...props,
      availableFunds,
      riskLevel,
      recommendation,
      assessedAt: new Date(),
    });
  }

  public isSafe(): boolean {
    return this.props.riskLevel === RiskLevel.BAIXO;
  }

  public isRisky(): boolean {
    return this.props.riskLevel === RiskLevel.ALTO;
  }
}
