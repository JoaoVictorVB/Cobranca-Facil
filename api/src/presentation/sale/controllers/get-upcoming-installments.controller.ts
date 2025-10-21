import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUpcomingInstallmentsUseCase } from '../../../application/sale/use-cases/get-upcoming-installments.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { InstallmentResponseDto } from '../dto/installment.response.dto';

@ApiTags(SWAGGER_TAGS.SALES)
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class GetUpcomingInstallmentsController {
  constructor(private readonly getUpcomingInstallmentsUseCase: GetUpcomingInstallmentsUseCase) {}

  @Get('installments/upcoming')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get upcoming installments' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiOkResponse({ description: 'List of upcoming installments', type: [InstallmentResponseDto] })
  async handler(
    @Query('days') days?: number,
    @User('id') userId?: string,
  ): Promise<InstallmentResponseDto[]> {
    const installments = await this.getUpcomingInstallmentsUseCase.execute({ days }, userId);
    return installments.map((installment) => InstallmentResponseDto.fromDomain(installment));
  }
}
