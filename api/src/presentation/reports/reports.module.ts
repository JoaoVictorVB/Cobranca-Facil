import { Module } from '@nestjs/common';
import { GetDailySalesUseCase } from '../../application/reports/use-cases/get-daily-sales.use-case';
import { GetMonthComparisonUseCase } from '../../application/reports/use-cases/get-month-comparison.use-case';
import { GetMonthlySummaryUseCase } from '../../application/reports/use-cases/get-monthly-summary.use-case';
import { GetPaymentStatusUseCase } from '../../application/reports/use-cases/get-payment-status.use-case';
import { GetPeriodSummaryUseCase } from '../../application/reports/use-cases/get-period-summary.use-case';
import { GetTopClientsUseCase } from '../../application/reports/use-cases/get-top-clients.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ReportsController } from './reports.controller';

@Module({
  controllers: [ReportsController],
  providers: [
    PrismaService,
    GetMonthlySummaryUseCase,
    GetDailySalesUseCase,
    GetPaymentStatusUseCase,
    GetTopClientsUseCase,
    GetPeriodSummaryUseCase,
    GetMonthComparisonUseCase,
  ],
})
export class ReportsModule {}
