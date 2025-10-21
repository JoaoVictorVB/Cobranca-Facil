import { Module } from '@nestjs/common';
import { CreateSaleUseCase } from '../../application/sale/use-cases/create-sale.use-case';
import { DeleteSaleUseCase } from '../../application/sale/use-cases/delete-sale.use-case';
import { GetInstallmentsByMonthUseCase } from '../../application/sale/use-cases/get-installments-by-month.use-case';
import { GetOverdueInstallmentsUseCase } from '../../application/sale/use-cases/get-overdue-installments.use-case';
import { GetUpcomingInstallmentsUseCase } from '../../application/sale/use-cases/get-upcoming-installments.use-case';
import { PayInstallmentUseCase } from '../../application/sale/use-cases/pay-installment.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InstallmentRepository } from '../../infrastructure/repositories/installment.repository';
import { SaleRepository } from '../../infrastructure/repositories/sale.repository';
import { ClientModule } from '../client/client.module';
import {
  CreateSaleController,
  DeleteSaleController,
  GetInstallmentsByMonthController,
  GetOverdueInstallmentsController,
  GetUpcomingInstallmentsController,
  PayInstallmentController,
} from './controllers';

@Module({
  imports: [ClientModule],
  controllers: [
    CreateSaleController,
    DeleteSaleController,
    PayInstallmentController,
    GetUpcomingInstallmentsController,
    GetOverdueInstallmentsController,
    GetInstallmentsByMonthController,
  ],
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
    CreateSaleUseCase,
    DeleteSaleUseCase,
    PayInstallmentUseCase,
    GetUpcomingInstallmentsUseCase,
    GetOverdueInstallmentsUseCase,
    GetInstallmentsByMonthUseCase,
  ],
})
export class SaleModule {}
