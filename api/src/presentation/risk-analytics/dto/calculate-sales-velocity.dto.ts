import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CalculateSalesVelocityDto {
  @ApiProperty({
    description: 'Reseller user ID',
    example: 'uuid-reseller-123',
  })
  @IsString()
  @IsNotEmpty()
  resellerId: string;

  @ApiProperty({
    description: 'Number of days to analyze (default: 60)',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  days?: number;
}
