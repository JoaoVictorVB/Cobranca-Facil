export interface MonthlySummaryDto {
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

export interface DailySalesDto {
  date: string;
  totalSales: number;
  salesCount: number;
}

export interface PaymentStatusDto {
  status: 'pago' | 'pendente' | 'atrasado';
  count: number;
  totalAmount: number;
}

export interface TopClientsDto {
  clientId: string;
  clientName: string;
  totalPurchases: number;
  totalPaid: number;
  totalPending: number;
}
