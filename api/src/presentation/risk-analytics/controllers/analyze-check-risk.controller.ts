import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyzeCheckRiskUseCase } from '../../../application/risk-analytics/use-cases/analyze-check-risk.use-case';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { SWAGGER_TAGS } from '../../../common/swagger/swagger-tags';
import { AnalyzeCheckRiskDto } from '../dto/analyze-check-risk.dto';
import { CheckRiskAssessmentResponseDto } from '../dto/check-risk-assessment.response.dto';

@ApiTags(SWAGGER_TAGS.RISK_ANALYTICS)
@ApiBearerAuth()
@Controller('risk-analytics/check-risk')
@UseGuards(JwtAuthGuard)
export class AnalyzeCheckRiskController {
  constructor(private readonly useCase: AnalyzeCheckRiskUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Analyze check payment risk based on sales velocity' })
  async execute(
    @Body() dto: AnalyzeCheckRiskDto,
    @User('id') supplierId: string,
  ): Promise<CheckRiskAssessmentResponseDto> {
    const assessment = await this.useCase.execute(
      {
        resellerId: dto.resellerId,
        checkDate: new Date(dto.checkDate),
        checkAmount: dto.checkAmount,
      },
      supplierId,
    );
    return CheckRiskAssessmentResponseDto.fromDomain(assessment);
  }
}
