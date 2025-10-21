import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IInstallmentRepository } from '../../../domain/sale/repositories/installment.repository.interface';
import { ISaleRepository } from '../../../domain/sale/repositories/sale.repository.interface';
import { IUseCase } from '../../common/use-case.interface';

@Injectable()
export class DeleteSaleUseCase implements IUseCase<string, void> {
  constructor(
    @Inject('ISaleRepository')
    private readonly saleRepository: ISaleRepository,
    @Inject('IInstallmentRepository')
    private readonly installmentRepository: IInstallmentRepository,
  ) {}

  async execute(saleId: string, userId?: string): Promise<void> {
    // Verifica se a venda existe e pertence ao usuário
    const sale = await this.saleRepository.findById(saleId, userId);
    
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${saleId} not found`);
    }

    // Deleta todas as parcelas associadas à venda
    const installments = await this.installmentRepository.findBySaleId(saleId);
    for (const installment of installments) {
      await this.installmentRepository.delete(installment.id);
    }

    // Deleta a venda
    await this.saleRepository.delete(saleId);
  }
}
