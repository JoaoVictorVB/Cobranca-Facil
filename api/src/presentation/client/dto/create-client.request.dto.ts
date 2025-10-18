import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientRequestDto {
  @ApiProperty({ description: 'Client name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Who referred this client' })
  @IsString()
  @IsOptional()
  referredBy?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Additional observations about the client' })
  @IsString()
  @IsOptional()
  observation?: string;
}
