import { Inject, Injectable } from '@nestjs/common';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import {
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
export class PayInstallmentUseCase implements IUseCase<PayInstallmentRequest, Installment> {
  constructor(
    @Inject('ISaleRepository')
    private readonly saleRepository: ISaleRepository,
    @Inject('IInstallmentRepository')
    private readonly installmentRepository: IInstallmentRepository,
  ) {}

  async execute(request: PayInstallmentRequest): Promise<Installment> {
    const installment = await this.installmentRepository.findById(request.installmentId);

    if (!installment) {
      throw new InstallmentNotFoundError(request.installmentId);
    }

    // Verificar se já tinha algum valor pago (PAGO ou PARCIAL)
    const hadPreviousPayment = installment.paidAmount && installment.paidAmount.amount > 0;
    const previousPaidAmount = installment.paidAmount?.amount || 0;

    installment.markAsPaid(request.amount, request.paidDate);
    const updatedInstallment = await this.installmentRepository.update(installment);

    const sale = await this.saleRepository.findById(installment.saleId);
    if (!sale) {
      throw new SaleNotFoundError(installment.saleId);
    }

    // Se já tinha pagamento (completo OU parcial), remover o valor anterior
    if (hadPreviousPayment) {
      sale.removePayment(previousPaidAmount);
    }
    sale.addPayment(request.amount);
    await this.saleRepository.update(sale);

    return updatedInstallment;
  }
}

