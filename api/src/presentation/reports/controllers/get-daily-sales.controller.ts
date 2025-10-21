import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetDailySalesUseCase } from '../../../application/reports/use-cases/get-daily-sales.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { DailySalesResponseDto } from '../dto/reports.response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetDailySalesController {
  constructor(private readonly getDailySalesUseCase: GetDailySalesUseCase) {}

  @Get('daily-sales')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get daily sales for a period' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiOkResponse({
    description: 'Daily sales retrieved successfully',
    type: [DailySalesResponseDto],
  })
  async handler(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<DailySalesResponseDto[]> {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate ? new Date(endDate) : now;

    return this.getDailySalesUseCase.execute({
      startDate: start,
      endDate: end,
    });
  }
}
