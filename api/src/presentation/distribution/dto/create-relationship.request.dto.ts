import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRelationshipRequestDto {
  @ApiProperty({ description: 'Reseller email or user ID' })
  @IsNotEmpty()
  @IsString()
  resellerIdentifier: string;
}
