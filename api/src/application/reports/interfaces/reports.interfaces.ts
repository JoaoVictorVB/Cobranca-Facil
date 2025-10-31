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

export interface MonthComparison {
  months: {
    month: string;
    totalExpected: number;
    totalReceived: number;
    totalPending: number;
    totalOverdue: number;
    receivedPercentage: number;
  }[];
}
