import { PaymentFrequency } from '../../../domain/common/enums';

export interface CreateSaleData {
  clientId: string;
  itemDescription: string;
  totalValue: number;
  totalInstallments: number;
  paymentFrequency: PaymentFrequency;
  firstDueDate: Date | string;
  saleDate?: Date | string;
}
