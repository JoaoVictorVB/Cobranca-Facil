export enum RiskLevel {
  BAIXO = 'BAIXO',   // 🟢 Green - Safe (>120%)
  MEDIO = 'MEDIO',   // 🟡 Yellow - Tight (100-120%)
  ALTO = 'ALTO',     // 🔴 Red - Risky (<100%)
}

export interface SalesVelocityResult {
  dailyAverage: number;
  totalRevenue: number;
  periodDays: number;
  salesCount: number;
}

export interface CheckRiskAnalysis {
  riskLevel: RiskLevel;
  checkAmount: number;
  checkDate: Date;
  daysUntilCheck: number;
  projectedRevenue: number;
  currentBalance: number;
  availableFunds: number;
  coveragePercentage: number;
  recommendation: string;
}
