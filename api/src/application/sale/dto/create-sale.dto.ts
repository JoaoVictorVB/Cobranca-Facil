import { PaymentFrequency } from '../../../domain/common/enums';

export interface CreateSaleDto {
  clientId: string;
  itemDescription: string;
  totalValue: number;
  totalInstallments: number;
  paymentFrequency: PaymentFrequency;
  firstDueDate: Date;
  saleDate?: Date;
}
