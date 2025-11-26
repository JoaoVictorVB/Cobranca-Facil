import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AnalyzeCheckRiskDto {
  @ApiProperty({
    description: 'Reseller user ID',
    example: 'uuid-reseller-123',
  })
  @IsString()
  @IsNotEmpty()
  resellerId: string;

  @ApiProperty({
    description: 'Check due date (must be in the future)',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  checkDate: string;

  @ApiProperty({
    description: 'Check amount in BRL',
    example: 5000.0,
  })
  @IsNumber()
  @Min(0.01)
  checkAmount: number;
}
