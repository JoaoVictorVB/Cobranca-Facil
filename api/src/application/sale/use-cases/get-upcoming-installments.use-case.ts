import { Injectable } from '@nestjs/common';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

interface GetUpcomingInstallmentsRequest {
  days?: number;
}

@Injectable()
export class GetUpcomingInstallmentsUseCase implements IUseCase<GetUpcomingInstallmentsRequest, Installment[]> {
  constructor(private readonly installmentRepository: IInstallmentRepository) {}

  async execute(request: GetUpcomingInstallmentsRequest): Promise<Installment[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (request.days || 30));

    return await this.installmentRepository.findByDueDateRange(startDate, endDate);
  }
}
