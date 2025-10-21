import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetInstallmentsByMonthUseCase } from '../../../application/sale/use-cases/get-installments-by-month.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { InstallmentResponseDto } from '../dto/installment.response.dto';

@ApiTags(SWAGGER_TAGS.SALES)
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class GetInstallmentsByMonthController {
  constructor(private readonly getInstallmentsByMonthUseCase: GetInstallmentsByMonthUseCase) {}

  @Get('installments/by-month')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get installments by month and year' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiOkResponse({ description: 'List of installments for the specified month', type: [InstallmentResponseDto] })
  async handler(
    @Query('year') year: string,
    @Query('month') month: string,
    @User('id') userId?: string,
  ): Promise<InstallmentResponseDto[]> {
    const installments = await this.getInstallmentsByMonthUseCase.execute(
      {
        year: parseInt(year),
        month: parseInt(month),
      },
      userId,
    );
    return installments.map((installment) => InstallmentResponseDto.fromDomain(installment));
  }
}
