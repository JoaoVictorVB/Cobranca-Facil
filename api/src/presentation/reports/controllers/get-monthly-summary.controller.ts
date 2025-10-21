import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetMonthlySummaryUseCase } from '../../../application/reports/use-cases/get-monthly-summary.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { MonthlySummaryResponseDto } from '../dto/reports.response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetMonthlySummaryController {
  constructor(private readonly getMonthlySummaryUseCase: GetMonthlySummaryUseCase) {}

  @Get('monthly-summary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get monthly payment summary' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiOkResponse({
    description: 'Monthly summary retrieved successfully',
    type: MonthlySummaryResponseDto,
  })
  async handler(
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
}
