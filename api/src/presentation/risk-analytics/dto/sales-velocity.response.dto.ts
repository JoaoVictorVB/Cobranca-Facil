import { ApiProperty } from '@nestjs/swagger';
import { SalesVelocity } from '../../../domain/risk-analytics/entities/sales-velocity.entity';

export class SalesVelocityResponseDto {
  @ApiProperty({ example: 'uuid-reseller-123' })
  resellerId: string;

  @ApiProperty({ example: 60 })
  periodDays: number;

  @ApiProperty({ example: 30000.0 })
  totalRevenue: number;

  @ApiProperty({ example: 500.0 })
  dailyAverage: number;

  @ApiProperty({ example: 45 })
  transactionCount: number;

  @ApiProperty({ example: '2025-11-24T19:35:00.000Z' })
  calculatedAt: Date;

  static fromDomain(velocity: SalesVelocity): SalesVelocityResponseDto {
    const dto = new SalesVelocityResponseDto();
    dto.resellerId = velocity.resellerId;
    dto.periodDays = velocity.periodDays;
    dto.totalRevenue = velocity.totalRevenue;
    dto.dailyAverage = velocity.dailyAverage;
    dto.transactionCount = velocity.transactionCount;
    dto.calculatedAt = velocity.calculatedAt;
    return dto;
  }
}
