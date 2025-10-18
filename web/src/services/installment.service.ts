import { api } from './api';

export enum PaymentStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  ATRASADO = 'atrasado',
}

export interface Installment {
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

export interface PayInstallmentInput {
  amount: number;
  paidDate?: string;
}

class InstallmentService {
  async payInstallment(id: string, data: PayInstallmentInput): Promise<Installment> {
    const response = await api.put<Installment>(`/sales/installments/${id}/pay`, data);
    return response.data;
  }

  async getUpcoming(): Promise<Installment[]> {
    const response = await api.get<Installment[]>('/sales/installments/upcoming');
    return response.data;
  }

  async getOverdue(): Promise<Installment[]> {
    const response = await api.get<Installment[]>('/sales/installments/overdue');
    return response.data;
  }
}

export const installmentService = new InstallmentService();
