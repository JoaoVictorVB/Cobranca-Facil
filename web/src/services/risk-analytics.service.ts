import { api } from './api';

export interface SalesVelocity {
  resellerId: string;
  periodDays: number;
  totalRevenue: number;
  dailyAverage: number;
  transactionCount: number;
  calculatedAt: Date;
}

export interface CheckRiskAssessment {
  resellerId: string;
  checkAmount: number;
  checkDate: Date;
  riskLevel: 'BAIXO' | 'MEDIO' | 'ALTO';
  currentBalance: number;
  projectedRevenue: number;
  stockValue: number;
  daysUntilCheck: number;
  availableFunds: number;
  recommendation: string;
  assessedAt: Date;
}

export interface CalculateSalesVelocityDto {
  resellerId: string;
  days?: number;
}

export interface AnalyzeCheckRiskDto {
  resellerId: string;
  checkDate: string;
  checkAmount: number;
}

export const riskAnalyticsService = {
  async calculateSalesVelocity(data: CalculateSalesVelocityDto): Promise<SalesVelocity> {
    const response = await api.post<SalesVelocity>('/risk-analytics/sales-velocity', data);
    return response.data;
  },

  async analyzeCheckRisk(data: AnalyzeCheckRiskDto): Promise<CheckRiskAssessment> {
    const response = await api.post<CheckRiskAssessment>('/risk-analytics/check-risk', data);
    return response.data;
  },
};
