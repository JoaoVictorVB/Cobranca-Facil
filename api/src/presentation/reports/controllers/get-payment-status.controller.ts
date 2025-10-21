import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPaymentStatusUseCase } from '../../../application/reports/use-cases/get-payment-status.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { PaymentStatusResponseDto } from '../dto/reports.response.dto';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetPaymentStatusController {
  constructor(private readonly getPaymentStatusUseCase: GetPaymentStatusUseCase) {}

  @Get('payment-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status distribution' })
  @ApiOkResponse({
    description: 'Payment status retrieved successfully',
    type: [PaymentStatusResponseDto],
  })
  async handler(@User('id') userId?: string): Promise<PaymentStatusResponseDto[]> {
    return this.getPaymentStatusUseCase.execute(userId);
  }
}
