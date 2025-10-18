import { Injectable } from '@nestjs/common';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import {
    InstallmentAlreadyPaidError,
    InstallmentNotFoundError,
    SaleNotFoundError,
} from '../../../domain/sale/errors/sale.errors';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { ISaleRepository } from '../../../domain/sale/repositories/sale.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

interface PayInstallmentRequest {
  installmentId: string;
  amount: number;
  paidDate?: Date;
}

@Injectable()
export class PayInstallmentUseCase
  implements IUseCase<PayInstallmentRequest, Installment>
{
  constructor(
    private readonly installmentRepository: IInstallmentRepository,
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(request: PayInstallmentRequest): Promise<Installment> {
    const installment = await this.installmentRepository.findById(
      request.installmentId,
    );

    if (!installment) {
      throw new InstallmentNotFoundError(request.installmentId);
    }

    // Verificar se já foi paga
    if (installment.isPaid()) {
      throw new InstallmentAlreadyPaidError(request.installmentId);
    }

    // Marcar como paga
    installment.markAsPaid(request.amount, request.paidDate);
    const updatedInstallment =
      await this.installmentRepository.update(installment);

    // Atualizar total pago da venda
    const sale = await this.saleRepository.findById(installment.saleId);
    if (!sale) {
      throw new SaleNotFoundError(installment.saleId);
    }

    sale.addPayment(request.amount);
    await this.saleRepository.update(sale);

    return updatedInstallment;
  }
}
