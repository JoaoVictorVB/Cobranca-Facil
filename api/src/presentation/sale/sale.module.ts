import { Module } from '@nestjs/common';
import { CreateSaleUseCase } from '../../application/sale/use-cases/create-sale.use-case';
import { GetOverdueInstallmentsUseCase } from '../../application/sale/use-cases/get-overdue-installments.use-case';
import { GetUpcomingInstallmentsUseCase } from '../../application/sale/use-cases/get-upcoming-installments.use-case';
import { PayInstallmentUseCase } from '../../application/sale/use-cases/pay-installment.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ClientRepository } from '../../infrastructure/repositories/client.repository';
import { InstallmentRepository } from '../../infrastructure/repositories/installment.repository';
import { SaleRepository } from '../../infrastructure/repositories/sale.repository';
import { ClientModule } from '../client/client.module';
import { SaleController } from './sale.controller';

@Module({
  imports: [ClientModule],
  controllers: [SaleController],
  providers: [
    PrismaService,
    {
      provide: 'ISaleRepository',
      useClass: SaleRepository,
    },
    {
      provide: 'IInstallmentRepository',
      useClass: InstallmentRepository,
    },
    {
      provide: CreateSaleUseCase,
      useFactory: (
        saleRepository: SaleRepository,
        installmentRepository: InstallmentRepository,
        clientRepository: ClientRepository,
      ) => {
        return new CreateSaleUseCase(saleRepository, installmentRepository, clientRepository);
      },
      inject: ['ISaleRepository', 'IInstallmentRepository', 'IClientRepository'],
    },
    {
      provide: PayInstallmentUseCase,
      useFactory: (
        installmentRepository: InstallmentRepository,
        saleRepository: SaleRepository,
      ) => {
        return new PayInstallmentUseCase(installmentRepository, saleRepository);
      },
      inject: ['IInstallmentRepository', 'ISaleRepository'],
    },
    {
      provide: GetUpcomingInstallmentsUseCase,
      useFactory: (installmentRepository: InstallmentRepository) => {
        return new GetUpcomingInstallmentsUseCase(installmentRepository);
      },
      inject: ['IInstallmentRepository'],
    },
    {
      provide: GetOverdueInstallmentsUseCase,
      useFactory: (installmentRepository: InstallmentRepository) => {
        return new GetOverdueInstallmentsUseCase(installmentRepository);
      },
      inject: ['IInstallmentRepository'],
    },
  ],
})
export class SaleModule {}
