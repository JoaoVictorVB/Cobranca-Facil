export interface MonthlySummaryDto {
  month: string; // YYYY-MM
  totalExpected: number; // Total esperado de receber no mês
  totalReceived: number; // Total efetivamente recebido
  totalPending: number; // Total ainda pendente
  totalOverdue: number; // Total em atraso
  receivedPercentage: number; // Percentual recebido
  upcomingInstallments: number; // Parcelas a vencer
  overdueInstallments: number; // Parcelas atrasadas
  paidInstallments: number; // Parcelas pagas
}

export interface DailySalesDto {
  date: string; // YYYY-MM-DD
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
