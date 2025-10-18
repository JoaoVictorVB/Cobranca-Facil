import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class PayInstallmentRequestDto {
  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Payment date' })
  @IsDateString()
  @IsOptional()
  paidDate?: string;
}
