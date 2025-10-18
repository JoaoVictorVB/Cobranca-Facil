import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetDailySalesUseCase } from '../../application/reports/use-cases/get-daily-sales.use-case';
import { GetMonthComparisonUseCase } from '../../application/reports/use-cases/get-month-comparison.use-case';
import { GetMonthlySummaryUseCase } from '../../application/reports/use-cases/get-monthly-summary.use-case';
import { GetPaymentStatusUseCase } from '../../application/reports/use-cases/get-payment-status.use-case';
import { GetPeriodSummaryUseCase } from '../../application/reports/use-cases/get-period-summary.use-case';
import { GetTopClientsUseCase } from '../../application/reports/use-cases/get-top-clients.use-case';
import {
    DailySalesResponseDto,
    MonthComparisonResponseDto,
    MonthlySummaryResponseDto,
    PaymentStatusResponseDto,
    PeriodSummaryResponseDto,
    TopClientsResponseDto,
} from './dto/reports.response.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly getMonthlySummaryUseCase: GetMonthlySummaryUseCase,
    private readonly getDailySalesUseCase: GetDailySalesUseCase,
    private readonly getPaymentStatusUseCase: GetPaymentStatusUseCase,
    private readonly getTopClientsUseCase: GetTopClientsUseCase,
    private readonly getPeriodSummaryUseCase: GetPeriodSummaryUseCase,
    private readonly getMonthComparisonUseCase: GetMonthComparisonUseCase,
  ) {}

  @Get('monthly-summary')
  @ApiOperation({ summary: 'Get monthly payment summary' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Monthly summary retrieved successfully',
    type: MonthlySummaryResponseDto,
  })
  async getMonthlySummary(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ): Promise<MonthlySummaryResponseDto> {
    const now = new Date();
    const targetYear = year ? parseInt(year) : now.getFullYear();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;

    return this.getMonthlySummaryUseCase.execute({
      year: targetYear,
      month: targetMonth,
    });
  }

  @Get('daily-sales')
  @ApiOperation({ summary: 'Get daily sales for a period' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Daily sales retrieved successfully',
    type: [DailySalesResponseDto],
  })
  async getDailySales(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<DailySalesResponseDto[]> {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate ? new Date(endDate) : now;

    return this.getDailySalesUseCase.execute({
      startDate: start,
      endDate: end,
    });
  }

  @Get('payment-status')
  @ApiOperation({ summary: 'Get payment status distribution' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    type: [PaymentStatusResponseDto],
  })
  async getPaymentStatus(): Promise<PaymentStatusResponseDto[]> {
    return this.getPaymentStatusUseCase.execute();
  }

  @Get('top-clients')
  @ApiOperation({ summary: 'Get top clients by purchase value' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Top clients retrieved successfully',
    type: [TopClientsResponseDto],
  })
  async getTopClients(@Query('limit') limit?: string): Promise<TopClientsResponseDto[]> {
    return this.getTopClientsUseCase.execute({
      limit: limit ? parseInt(limit) : 5,
    });
  }

  @Get('period-summary')
  @ApiOperation({ summary: 'Get summary for a custom date period' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Period summary retrieved successfully',
    type: PeriodSummaryResponseDto,
  })
  async getPeriodSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<PeriodSummaryResponseDto> {
    return this.getPeriodSummaryUseCase.execute({
      startDate: new Date(startDate + 'T00:00:00'),
      endDate: new Date(endDate + 'T23:59:59'),
    });
  }

  @Get('month-comparison')
  @ApiOperation({ summary: 'Compare multiple months' })
  @ApiQuery({ name: 'months', required: true, type: String, description: 'Comma-separated months in YYYY-MM format' })
  @ApiResponse({
    status: 200,
    description: 'Month comparison retrieved successfully',
    type: MonthComparisonResponseDto,
  })
  async getMonthComparison(@Query('months') months: string): Promise<MonthComparisonResponseDto> {
    // Parse "2024-10,2024-11,2024-12" into array of {year, month}
    const monthsArray = months.split(',').map((m) => {
      const [year, month] = m.trim().split('-');
      return { year: parseInt(year), month: parseInt(month) };
    });

    return this.getMonthComparisonUseCase.execute({ months: monthsArray });
  }
}
