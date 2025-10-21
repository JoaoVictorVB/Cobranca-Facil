import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetTopClientsUseCase } from '../../../application/reports/use-cases/get-top-clients.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { TopClientsResponseDto } from '../dto/reports.response.dto';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetTopClientsController {
  constructor(private readonly getTopClientsUseCase: GetTopClientsUseCase) {}

  @Get('top-clients')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top clients by purchase value' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Top clients retrieved successfully',
    type: [TopClientsResponseDto],
  })
  async handler(@Query('limit') limit?: string): Promise<TopClientsResponseDto[]> {
    return this.getTopClientsUseCase.execute({
      limit: limit ? parseInt(limit) : 5,
    });
  }
}
