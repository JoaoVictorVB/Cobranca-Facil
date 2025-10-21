import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetPeriodSummaryUseCase } from '../../../application/reports/use-cases/get-period-summary.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { PeriodSummaryResponseDto } from '../dto/reports.response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetPeriodSummaryController {
  constructor(private readonly getPeriodSummaryUseCase: GetPeriodSummaryUseCase) {}

  @Get('period-summary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get summary for a custom date period' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiOkResponse({
    description: 'Period summary retrieved successfully',
    type: PeriodSummaryResponseDto,
  })
  async handler(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<PeriodSummaryResponseDto> {
    return this.getPeriodSummaryUseCase.execute({
      startDate: new Date(startDate + 'T00:00:00'),
      endDate: new Date(endDate + 'T23:59:59'),
    });
  }
}
