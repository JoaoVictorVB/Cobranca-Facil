import { api } from './api';
import { PaymentFrequency, PaymentStatus } from './sale.service';

export interface ClientWithSales {
  id: string;
  name: string;
  phone?: string;
  referredBy?: string;
  address?: string;
  observation?: string;
  createdAt: string;
  updatedAt: string;
  sales: SaleWithInstallments[];
}

export interface SaleWithInstallments {
  id: string;
  clientId: string;
  itemDescription: string;
  totalValue: number;
  totalInstallments: number;
  paymentFrequency: PaymentFrequency;
  firstDueDate: string;
  totalPaid: number;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
  installments: InstallmentDetails[];
}

export interface InstallmentDetails {
  id: string;
  saleId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paidDate?: string;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalSales: number;
  totalPaid: number;
  totalPending: number;
  remainingInstallments: number;
  paymentFrequency?: PaymentFrequency;
}

class ClientWithSalesService {
  async findAllWithSales(): Promise<ClientWithSales[]> {
    // Agora usando endpoint dedicado que retorna vendas e parcelas
    const response = await api.get<ClientWithSales[]>('/clients/with-sales', {
      params: { page: 1, limit: 50 }
    });
    return response.data;
  }

  calculateClientStats(client: ClientWithSales): ClientStats {
    let totalSales = 0;
    let totalPaid = 0;
    let remainingInstallments = 0;
    let paymentFrequency: PaymentFrequency | undefined;

    client.sales?.forEach((sale) => {
      totalSales += sale.totalValue;
      totalPaid += sale.totalPaid || 0;
      
      if (!paymentFrequency && sale.paymentFrequency) {
        paymentFrequency = sale.paymentFrequency;
      }

      sale.installments?.forEach((installment) => {
        if (installment.status === PaymentStatus.PENDENTE || installment.status === PaymentStatus.ATRASADO) {
          remainingInstallments++;
        }
      });
    });

    return {
      totalSales,
      totalPaid,
      totalPending: totalSales - totalPaid,
      remainingInstallments,
      paymentFrequency,
    };
  }

  getInstallmentsSummary(client: ClientWithSales): string {
    const stats = this.calculateClientStats(client);
    const totalInstallments = client.sales?.reduce(
      (sum, sale) => sum + (sale.totalInstallments || 0),
      0
    ) || 0;
    const paidInstallments = totalInstallments - stats.remainingInstallments;
    
    return `${paidInstallments} de ${totalInstallments} restantes`;
  }
}

export const clientWithSalesService = new ClientWithSalesService();
