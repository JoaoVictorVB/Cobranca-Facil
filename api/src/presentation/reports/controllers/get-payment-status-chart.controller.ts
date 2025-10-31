import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPaymentStatusChartUseCase } from '../../../application/reports/use-cases/get-payment-status-chart.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { PaymentStatusResponseDto } from '../dto/reports.response.dto';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetPaymentStatusChartController {
  constructor(private readonly getPaymentStatusChartUseCase: GetPaymentStatusChartUseCase) {}

  @Get('payment-status-chart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status chart data (all installments)' })
  @ApiOkResponse({
    description: 'Payment status chart data retrieved successfully',
    type: [PaymentStatusResponseDto],
  })
  async handler(@User('id') userId?: string): Promise<PaymentStatusResponseDto[]> {
    return this.getPaymentStatusChartUseCase.execute(userId);
  }
}
