import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetMonthComparisonUseCase } from '../../../application/reports/use-cases/get-month-comparison.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { MonthComparisonResponseDto } from '../dto/reports.response.dto';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetMonthComparisonController {
  constructor(private readonly getMonthComparisonUseCase: GetMonthComparisonUseCase) {}

  @Get('month-comparison')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Compare multiple months' })
  @ApiQuery({
    name: 'months',
    required: true,
    type: String,
    description: 'Comma-separated months in YYYY-MM format',
  })
  @ApiOkResponse({
    description: 'Month comparison retrieved successfully',
    type: MonthComparisonResponseDto,
  })
  async handler(@Query('months') months: string): Promise<MonthComparisonResponseDto> {
    const monthsArray = months.split(',').map((m) => {
      const [year, month] = m.trim().split('-');
      return { year: parseInt(year), month: parseInt(month) };
    });

    return this.getMonthComparisonUseCase.execute({ months: monthsArray });
  }
}
