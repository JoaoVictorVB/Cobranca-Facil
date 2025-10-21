import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayInstallmentUseCase } from '../../../application/sale/use-cases/pay-installment.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { parseLocalDate } from '../../../common/utils/date.utils';
import { InstallmentResponseDto } from '../dto/installment.response.dto';
import { PayInstallmentRequestDto } from '../dto/pay-installment.request.dto';

@ApiTags(SWAGGER_TAGS.SALES)
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class PayInstallmentController {
  constructor(private readonly payInstallmentUseCase: PayInstallmentUseCase) {}

  @Put('installments/:id/pay')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pay an installment' })
  @ApiOkResponse({ description: 'Installment paid successfully', type: InstallmentResponseDto })
  async handler(
    @Param('id') id: string,
    @Body() dto: PayInstallmentRequestDto,
  ): Promise<InstallmentResponseDto> {
    const installment = await this.payInstallmentUseCase.execute({
      installmentId: id,
      amount: dto.amount,
      paidDate: dto.paidDate ? parseLocalDate(dto.paidDate) : undefined,
    });
    return InstallmentResponseDto.fromDomain(installment);
  }
}
