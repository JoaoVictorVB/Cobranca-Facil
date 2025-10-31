import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetTopClientsUseCase } from '../../../application/reports/use-cases/get-top-clients.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { TopClientsResponseDto } from '../dto/reports.response.dto';

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetTopClientsController {
  constructor(private readonly getTopClientsUseCase: GetTopClientsUseCase) {}

  @Get('top-clients')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top clients by purchase value' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of top clients to return (default: 5)',
  })
  @ApiOkResponse({
    description: 'Top clients retrieved successfully',
    type: [TopClientsResponseDto],
  })
  async handler(
    @Query('limit') limit?: number,
    @User('id') userId?: string,
  ): Promise<TopClientsResponseDto[]> {
    return this.getTopClientsUseCase.execute({ limit }, userId);
  }
}
