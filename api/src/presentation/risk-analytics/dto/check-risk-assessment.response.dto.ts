import { ApiProperty } from '@nestjs/swagger';
import { CheckRiskAssessment } from '../../../domain/risk-analytics/entities/check-risk-assessment.entity';

export class CheckRiskAssessmentResponseDto {
  @ApiProperty({ example: 'uuid-reseller-123' })
  resellerId: string;

  @ApiProperty({ example: 5000.0 })
  checkAmount: number;

  @ApiProperty({ example: '2025-12-31' })
  checkDate: Date;

  @ApiProperty({ example: 'BAIXO', enum: ['BAIXO', 'MEDIO', 'ALTO'] })
  riskLevel: string;

  @ApiProperty({ example: 0 })
  currentBalance: number;

  @ApiProperty({ example: 6000.0 })
  projectedRevenue: number;

  @ApiProperty({ example: 15000.0 })
  stockValue: number;

  @ApiProperty({ example: 37 })
  daysUntilCheck: number;

  @ApiProperty({ example: 6000.0 })
  availableFunds: number;

  @ApiProperty({ example: 'Seguro aceitar - margem de 20%+ disponível' })
  recommendation: string;

  @ApiProperty({ example: '2025-11-24T19:35:00.000Z' })
  assessedAt: Date;

  static fromDomain(assessment: CheckRiskAssessment): CheckRiskAssessmentResponseDto {
    const dto = new CheckRiskAssessmentResponseDto();
    dto.resellerId = assessment.resellerId;
    dto.checkAmount = assessment.checkAmount;
    dto.checkDate = assessment.checkDate;
    dto.riskLevel = assessment.riskLevel;
    dto.currentBalance = assessment.currentBalance;
    dto.projectedRevenue = assessment.projectedRevenue;
    dto.stockValue = assessment.stockValue;
    dto.daysUntilCheck = assessment.daysUntilCheck;
    dto.availableFunds = assessment.availableFunds;
    dto.recommendation = assessment.recommendation;
    dto.assessedAt = assessment.assessedAt;
    return dto;
  }
}
