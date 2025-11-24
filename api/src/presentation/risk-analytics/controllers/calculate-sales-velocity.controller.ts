import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CalculateSalesVelocityUseCase } from '../../../application/risk-analytics/use-cases/calculate-sales-velocity.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { CalculateSalesVelocityDto } from '../dto/calculate-sales-velocity.dto';
import { SalesVelocityResponseDto } from '../dto/sales-velocity.response.dto';

@ApiTags(SWAGGER_TAGS.RISK_ANALYTICS)
@ApiBearerAuth()
@Controller('risk-analytics/sales-velocity')
@UseGuards(JwtAuthGuard)
export class CalculateSalesVelocityController {
  constructor(private readonly useCase: CalculateSalesVelocityUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Calculate reseller sales velocity (run rate)' })
  async execute(
    @Body() dto: CalculateSalesVelocityDto,
    @User('id') supplierId: string,
  ): Promise<SalesVelocityResponseDto> {
    const velocity = await this.useCase.execute(dto, supplierId);
    return SalesVelocityResponseDto.fromDomain(velocity);
  }
}
