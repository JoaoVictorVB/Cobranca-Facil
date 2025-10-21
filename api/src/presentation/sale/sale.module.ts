import { Module } from '@nestjs/common';
import { CreateSaleUseCase } from '../../application/sale/use-cases/create-sale.use-case';
import { GetOverdueInstallmentsUseCase } from '../../application/sale/use-cases/get-overdue-installments.use-case';
import { GetUpcomingInstallmentsUseCase } from '../../application/sale/use-cases/get-upcoming-installments.use-case';
import { PayInstallmentUseCase } from '../../application/sale/use-cases/pay-installment.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InstallmentRepository } from '../../infrastructure/repositories/installment.repository';
import { SaleRepository } from '../../infrastructure/repositories/sale.repository';
import { ClientModule } from '../client/client.module';
import {
  CreateSaleController,
  GetOverdueInstallmentsController,
  GetUpcomingInstallmentsController,
  PayInstallmentController,
} from './controllers';

@Module({
  imports: [ClientModule],
  controllers: [
    CreateSaleController,
    PayInstallmentController,
    GetUpcomingInstallmentsController,
    GetOverdueInstallmentsController,
  ],
  providers: [
    PrismaService,
    SaleRepository,
    InstallmentRepository,
    CreateSaleUseCase,
    PayInstallmentUseCase,
    GetUpcomingInstallmentsUseCase,
    GetOverdueInstallmentsUseCase,
  ],
})
export class SaleModule {}
