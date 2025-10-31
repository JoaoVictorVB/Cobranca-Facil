import { api } from './api';

export interface MonthlySummary {
  month: string;
  totalExpected: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  receivedPercentage: number;
  upcomingInstallments: number;
  overdueInstallments: number;
  paidInstallments: number;
}

export interface DailySales {
  date: string;
  totalSales: number;
  salesCount: number;
}

export interface PaymentStatus {
  status: 'pago' | 'pendente' | 'atrasado' | 'parcial';
  count: number;
  totalAmount: number;
}

export interface TopClient {
  clientId: string;
  clientName: string;
  totalPurchases: number;
  totalPaid: number;
  totalPending: number;
}

export interface RevenueChartData {
  month: string;
  expected: number;
  received: number;
}

export interface PeriodSummary {
  startDate: string;
  endDate: string;
  totalExpected: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  receivedPercentage: number;
  installmentsCount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface MonthData {
  month: string;
  totalExpected: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  receivedPercentage: number;
}

export interface MonthComparison {
  months: MonthData[];
}

export interface MonthlyExpectedRevenue {
  month: string;
  year: number;
  expected: number;
}

export interface ClientStatus {
  status: string;
  count: number;
}

export const reportsService = {
  async getMonthlySummary(year?: number, month?: number): Promise<MonthlySummary> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const response = await api.get<MonthlySummary>(`/reports/monthly-summary?${params}`);
    return response.data;
  },

  async getDailySales(startDate?: string, endDate?: string): Promise<DailySales[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get<DailySales[]>(`/reports/daily-sales?${params}`);
    return response.data;
  },

  async getPaymentStatus(): Promise<PaymentStatus[]> {
    const response = await api.get<PaymentStatus[]>('/reports/payment-status');
    return response.data;
  },

  async getPaymentStatusChart(): Promise<PaymentStatus[]> {
    const response = await api.get<PaymentStatus[]>('/reports/payment-status-chart');
    return response.data;
  },

  async getRevenueChart(): Promise<RevenueChartData[]> {
    const response = await api.get<RevenueChartData[]>('/reports/revenue-chart');
    return response.data;
  },

  async getTopClients(limit: number = 5): Promise<TopClient[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    const response = await api.get<TopClient[]>(`/reports/top-clients?${params}`);
    return response.data;
  },

  async getTopClientsChart(limit: number = 10): Promise<TopClient[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    const response = await api.get<TopClient[]>(`/reports/top-clients-chart?${params}`);
    return response.data;
  },

  async getPeriodSummary(startDate: string, endDate: string): Promise<PeriodSummary> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    const response = await api.get<PeriodSummary>(`/reports/period-summary?${params}`);
    return response.data;
  },

  async getMonthComparison(months: string[]): Promise<MonthComparison> {
    const params = new URLSearchParams();
    params.append('months', months.join(','));
    
    const response = await api.get<MonthComparison>(`/reports/month-comparison?${params}`);
    return response.data;
  },

  async getExpectedRevenue(): Promise<MonthlyExpectedRevenue[]> {
    const response = await api.get<MonthlyExpectedRevenue[]>('/reports/expected-revenue');
    return response.data;
  },

  async getClientsStatus(year?: number, month?: number): Promise<ClientStatus[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const response = await api.get<ClientStatus[]>(`/reports/clients-status?${params}`);
    return response.data;
  },
};
