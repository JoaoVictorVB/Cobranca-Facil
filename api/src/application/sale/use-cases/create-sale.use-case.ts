import { Inject, Injectable } from '@nestjs/common';
import { addBiweekly, addMonths, parseLocalDate } from '../../../common/utils/date.utils';
import { ClientNotFoundError } from '../../../domain/client/errors/client.errors';
import { IClientRepository } from '../../../domain/client/repositories/client.repository.interface';
import { PaymentFrequency } from '../../../domain/common/enums';
import { Installment } from '../../../domain/sale/entities/installment.entity';
import { Sale } from '../../../domain/sale/entities/sale.entity';
import {
  InvalidInstallmentNumberError,
  InvalidSaleValueError,
} from '../../../domain/sale/errors/sale.errors';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { ISaleRepository } from '../../../domain/sale/repositories/sale.repository.interface';
import { IUseCase } from '../../common/use-case.interface';
import { CreateSaleData } from '../interfaces/sale.interfaces';

@Injectable()
export class CreateSaleUseCase implements IUseCase<CreateSaleData, Sale> {
  constructor(
    @Inject('ISaleRepository')
    private readonly saleRepository: ISaleRepository,
    @Inject('IInstallmentRepository')
    private readonly installmentRepository: IInstallmentRepository,
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(request: CreateSaleData, userId: string): Promise<Sale> {
    if (request.totalValue <= 0) {
      throw new InvalidSaleValueError(request.totalValue);
    }

    if (request.totalInstallments < 1 || request.totalInstallments > 24) {
      throw new InvalidInstallmentNumberError(request.totalInstallments);
    }

    const client = await this.clientRepository.findById(request.clientId, userId);
    if (!client) {
      throw new ClientNotFoundError(request.clientId);
    }

    const sale = Sale.create({
      clientId: request.clientId,
      itemDescription: request.itemDescription,
      totalValue: request.totalValue,
      totalInstallments: request.totalInstallments,
      paymentFrequency: request.paymentFrequency,
      firstDueDate:
        typeof request.firstDueDate === 'string'
          ? parseLocalDate(request.firstDueDate)
          : request.firstDueDate,
      saleDate: request.saleDate
        ? typeof request.saleDate === 'string'
          ? parseLocalDate(request.saleDate)
          : request.saleDate
        : undefined,
    });

    const createdSale = await this.saleRepository.create(sale, userId);

    const installments = this.generateInstallments(createdSale);
    await this.installmentRepository.createMany(installments);

    return createdSale;
  }

  private generateInstallments(sale: Sale): Installment[] {
    const installments: Installment[] = [];
    const installmentValue = sale.calculateInstallmentValue();
    const firstDueDate = new Date(sale.firstDueDate);

    for (let i = 1; i <= sale.totalInstallments; i++) {
      let dueDate: Date;
      
      if (i === 1) {
        dueDate = new Date(firstDueDate);
      } else {
        if (sale.paymentFrequency === PaymentFrequency.MENSAL) {
          dueDate = addMonths(firstDueDate, i - 1);
        } else {
          dueDate = addBiweekly(firstDueDate, i - 1);
        }
      }

      const installment = Installment.create({
        saleId: sale.id,
        installmentNumber: i,
        amount: installmentValue.amount,
        dueDate,
      });

      installments.push(installment);
    }

    return installments;
  }
}

