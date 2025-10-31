import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetTopClientsChartUseCase } from '../../../application/reports/use-cases/get-top-clients-chart.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { TopClientsResponseDto } from '../dto/reports.response.dto';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetTopClientsChartController {
  constructor(private readonly getTopClientsChartUseCase: GetTopClientsChartUseCase) {}

  @Get('top-clients-chart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top clients chart data (all clients sorted)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of top clients to return (default: 10)',
  })
  @ApiOkResponse({
    description: 'Top clients chart data retrieved successfully',
    type: [TopClientsResponseDto],
  })
  async handler(
    @Query('limit') limit?: number,
    @User('id') userId?: string,
  ): Promise<TopClientsResponseDto[]> {
    return this.getTopClientsChartUseCase.execute({ limit }, userId);
  }
}
