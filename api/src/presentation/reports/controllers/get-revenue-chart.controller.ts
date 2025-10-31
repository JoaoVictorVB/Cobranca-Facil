import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRevenueChartUseCase } from '../../../application/reports/use-cases/get-revenue-chart.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

interface RevenueChartResponse {
  month: string;
  expected: number;
  received: number;
}

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetRevenueChartController {
  constructor(private readonly getRevenueChartUseCase: GetRevenueChartUseCase) {}

  @Get('revenue-chart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue chart data for multiple months' })
  @ApiOkResponse({
    description: 'Revenue chart data retrieved successfully',
  })
  async handler(@User('id') userId?: string): Promise<RevenueChartResponse[]> {
    return this.getRevenueChartUseCase.execute({}, userId);
  }
}
