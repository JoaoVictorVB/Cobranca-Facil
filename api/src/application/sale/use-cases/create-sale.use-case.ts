import { Injectable } from '@nestjs/common';
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
import { CreateSaleDto } from '../dto/create-sale.dto';

@Injectable()
export class CreateSaleUseCase implements IUseCase<CreateSaleDto, Sale> {
  constructor(
    private readonly saleRepository: ISaleRepository,
    private readonly installmentRepository: IInstallmentRepository,
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(request: CreateSaleDto): Promise<Sale> {
    // Validar valor da venda
    if (request.totalValue <= 0) {
      throw new InvalidSaleValueError(request.totalValue);
    }

    // Validar número de parcelas
    if (request.totalInstallments < 1 || request.totalInstallments > 24) {
      throw new InvalidInstallmentNumberError(request.totalInstallments);
    }

    // Verificar se cliente existe
    const client = await this.clientRepository.findById(request.clientId);
    if (!client) {
      throw new ClientNotFoundError(request.clientId);
    }

    // Criar venda
    const sale = Sale.create({
      clientId: request.clientId,
      itemDescription: request.itemDescription,
      totalValue: request.totalValue,
      totalInstallments: request.totalInstallments,
      paymentFrequency: request.paymentFrequency,
      firstDueDate: request.firstDueDate,
      saleDate: request.saleDate,
    });

    const createdSale = await this.saleRepository.create(sale);

    // Gerar parcelas
    const installments = this.generateInstallments(createdSale);
    await this.installmentRepository.createMany(installments);

    return createdSale;
  }

  private generateInstallments(sale: Sale): Installment[] {
    const installments: Installment[] = [];
    const installmentValue = sale.calculateInstallmentValue();
    
    // Usar a data de primeiro vencimento definida pelo usuário
    let dueDate = new Date(sale.firstDueDate);

    for (let i = 1; i <= sale.totalInstallments; i++) {
      const installment = Installment.create({
        saleId: sale.id,
        installmentNumber: i,
        amount: installmentValue.amount,
        dueDate: new Date(dueDate),
      });

      installments.push(installment);

      // Próxima data de vencimento
      if (sale.paymentFrequency === PaymentFrequency.MENSAL) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      } else {
        // Quinzenal: adicionar 15 dias
        dueDate.setDate(dueDate.getDate() + 15);
      }
    }

    return installments;
  }
}
