import { Injectable } from '@nestjs/common';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

@Injectable()
export class GetOverdueInstallmentsUseCase implements IUseCase<void, Installment[]> {
  constructor(private readonly installmentRepository: IInstallmentRepository) {}

  async execute(): Promise<Installment[]> {
    const overdueInstallments = await this.installmentRepository.findOverdue();

    // Mark as overdue
    for (const installment of overdueInstallments) {
      installment.markAsOverdue();
      await this.installmentRepository.update(installment);
    }

    return overdueInstallments;
  }
}
