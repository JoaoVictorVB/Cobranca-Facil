import { Inject, Injectable } from '@nestjs/common';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

interface GetInstallmentsByMonthRequest {
  year: number;
  month: number;
}

@Injectable()
export class GetInstallmentsByMonthUseCase
  implements IUseCase<GetInstallmentsByMonthRequest, Installment[]>
{
  constructor(
    @Inject('IInstallmentRepository')
    private readonly installmentRepository: IInstallmentRepository,
  ) {}

  async execute(request: GetInstallmentsByMonthRequest, userId?: string): Promise<Installment[]> {
    const { year, month } = request;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await this.installmentRepository.findByDueDateRange(startDate, endDate, userId);
  }
}
