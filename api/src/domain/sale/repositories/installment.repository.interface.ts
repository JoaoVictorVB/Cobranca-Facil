import { Installment } from '../entities/installment.entity';

export interface IInstallmentRepository {
  create(installment: Installment): Promise<Installment>;
  createMany(installments: Installment[]): Promise<Installment[]>;
  findById(id: string): Promise<Installment | null>;
  findBySaleId(saleId: string): Promise<Installment[]>;
  findOverdue(): Promise<Installment[]>;
  findByDueDateRange(startDate: Date, endDate: Date): Promise<Installment[]>;
  update(installment: Installment): Promise<Installment>;
  delete(id: string): Promise<void>;
}
