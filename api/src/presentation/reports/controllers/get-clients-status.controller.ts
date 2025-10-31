import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetClientsStatusUseCase } from '../../../application/reports/use-cases/get-clients-status.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';

interface ClientStatusResponse {
  status: string;
  count: number;
}

@ApiTags(SWAGGER_TAGS.REPORTS)
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class GetClientsStatusController {
  constructor(private readonly getClientsStatusUseCase: GetClientsStatusUseCase) {}

  @Get('clients-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get clients status (up-to-date vs overdue)' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  async handler(
    @Query('year') year?: number,
    @Query('month') month?: number,
    @User('id') userId?: string,
  ): Promise<ClientStatusResponse[]> {
    return this.getClientsStatusUseCase.execute({ year, month }, userId);
  }
}
