import { Module } from '@nestjs/common';
import { GetClientsStatusUseCase } from '../../application/reports/use-cases/get-clients-status.use-case';
import { GetDailySalesUseCase } from '../../application/reports/use-cases/get-daily-sales.use-case';
import { GetExpectedRevenueUseCase } from '../../application/reports/use-cases/get-expected-revenue.use-case';
import { GetMonthComparisonUseCase } from '../../application/reports/use-cases/get-month-comparison.use-case';
import { GetMonthlySummaryUseCase } from '../../application/reports/use-cases/get-monthly-summary.use-case';
import { GetPaymentStatusChartUseCase } from '../../application/reports/use-cases/get-payment-status-chart.use-case';
import { GetPaymentStatusUseCase } from '../../application/reports/use-cases/get-payment-status.use-case';
import { GetPeriodSummaryUseCase } from '../../application/reports/use-cases/get-period-summary.use-case';
import { GetRevenueChartUseCase } from '../../application/reports/use-cases/get-revenue-chart.use-case';
import { GetTopClientsChartUseCase } from '../../application/reports/use-cases/get-top-clients-chart.use-case';
import { GetTopClientsUseCase } from '../../application/reports/use-cases/get-top-clients.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import {
    GetClientsStatusController,
    GetDailySalesController,
    GetExpectedRevenueController,
    GetMonthComparisonController,
    GetMonthlySummaryController,
    GetPaymentStatusChartController,
    GetPaymentStatusController,
    GetPeriodSummaryController,
    GetRevenueChartController,
    GetTopClientsChartController,
    GetTopClientsController,
} from './controllers';

@Module({
  controllers: [
    GetMonthlySummaryController,
    GetDailySalesController,
    GetPaymentStatusController,
    GetPaymentStatusChartController,
    GetTopClientsController,
    GetTopClientsChartController,
    GetPeriodSummaryController,
    GetMonthComparisonController,
    GetRevenueChartController,
    GetExpectedRevenueController,
    GetClientsStatusController,
  ],
  providers: [
    PrismaService,
    GetMonthlySummaryUseCase,
    GetDailySalesUseCase,
    GetPaymentStatusUseCase,
    GetPaymentStatusChartUseCase,
    GetTopClientsUseCase,
    GetTopClientsChartUseCase,
    GetPeriodSummaryUseCase,
    GetMonthComparisonUseCase,
    GetRevenueChartUseCase,
    GetExpectedRevenueUseCase,
    GetClientsStatusUseCase,
  ],
})
export class ReportsModule {}
