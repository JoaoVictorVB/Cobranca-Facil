import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';

export interface ClientWithSalesResponse {
  id: string;
  name: string;
  phone?: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
  sales: SaleWithInstallmentsResponse[];
}

export interface SaleWithInstallmentsResponse {
  id: string;
  clientId: string;
  itemDescription: string;
  totalValue: number;
  totalInstallments: number;
  paymentFrequency: string;
  totalPaid: number;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
  installments: InstallmentResponse[];
}

export interface InstallmentResponse {
  id: string;
  saleId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: string;
  paidDate?: Date;
  paidAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetAllClientsWithSalesUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(request: {
    page?: number;
    limit?: number;
  }): Promise<ClientWithSalesResponse[]> {
    return await this.clientRepository.findAllWithSales(
      request.page,
      request.limit,
    );
  }
}
