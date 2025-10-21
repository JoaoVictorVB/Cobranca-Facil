import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOverdueInstallmentsUseCase } from '../../../application/sale/use-cases/get-overdue-installments.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { InstallmentResponseDto } from '../dto/installment.response.dto';

@ApiTags(SWAGGER_TAGS.SALES)
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class GetOverdueInstallmentsController {
  constructor(private readonly getOverdueInstallmentsUseCase: GetOverdueInstallmentsUseCase) {}

  @Get('installments/overdue')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get overdue installments' })
  @ApiOkResponse({
    description: 'Overdue installments retrieved successfully',
    type: [InstallmentResponseDto],
  })
  async handler(@User('id') userId?: string): Promise<InstallmentResponseDto[]> {
    const installments = await this.getOverdueInstallmentsUseCase.execute(undefined, userId);
    return installments.map((installment) => InstallmentResponseDto.fromDomain(installment));
  }
}
