import { Inject, Injectable } from '@nestjs/common';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

@Injectable()
export class GetOverdueInstallmentsUseCase implements IUseCase<void, Installment[]> {
  constructor(
    @Inject('IInstallmentRepository')
    private readonly installmentRepository: IInstallmentRepository,
  ) {}

  async execute(_request: void, userId?: string): Promise<Installment[]> {
    const overdueInstallments = await this.installmentRepository.findOverdue(userId);

    for (const installment of overdueInstallments) {
      installment.markAsOverdue();
      await this.installmentRepository.update(installment);
    }

    return overdueInstallments;
  }
}

