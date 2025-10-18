import { api } from './api';

export enum PaymentFrequency {
  QUINZENAL = 'quinzenal',
  MENSAL = 'mensal',
}

export enum PaymentStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  ATRASADO = 'atrasado',
}

export interface Sale {
  id: string;
  clientId: string;
  itemDescription: string;
  totalValue: number;
  totalInstallments: number;
  paymentFrequency: PaymentFrequency;
  firstDueDate: Date;
  totalPaid: number;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Installment {
  id: string;
  saleId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paidDate?: Date;
  paidAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSaleDto {
  clientId: string;
  itemDescription: string;
  totalValue: number;
  totalInstallments: number;
  paymentFrequency: PaymentFrequency;
  firstDueDate: string;
  saleDate?: string;
}

export interface PayInstallmentDto {
  amount: number;
  paidDate?: string;
}

export const saleService = {
  async create(data: CreateSaleDto): Promise<Sale> {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  },

  async payInstallment(installmentId: string, data: PayInstallmentDto): Promise<Installment> {
    const response = await api.put<Installment>(`/sales/installments/${installmentId}/pay`, data);
    return response.data;
  },

  async getUpcomingInstallments(days: number = 30): Promise<Installment[]> {
    const response = await api.get<Installment[]>('/sales/installments/upcoming', {
      params: { days },
    });
    return response.data;
  },

  async getOverdueInstallments(): Promise<Installment[]> {
    const response = await api.get<Installment[]>('/sales/installments/overdue');
    return response.data;
  },
};
