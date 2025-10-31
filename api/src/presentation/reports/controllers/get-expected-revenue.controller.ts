import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetExpectedRevenueUseCase } from '../../../application/reports/use-cases/get-expected-revenue.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetExpectedRevenueController {
  constructor(private readonly getExpectedRevenueUseCase: GetExpectedRevenueUseCase) {}

  @Get('expected-revenue')
  @ApiOperation({
    summary: 'Obter receita esperada dos próximos 6 meses',
  })
  async getExpectedRevenue(@User('id') userId: string) {
    return this.getExpectedRevenueUseCase.execute(userId);
  }
}
