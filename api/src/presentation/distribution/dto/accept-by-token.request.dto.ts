import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AcceptByTokenRequestDto {
  @ApiProperty({ 
    description: 'Invite token (6-character code)',
    example: 'ABC123',
    minLength: 6,
    maxLength: 6
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Token must be exactly 6 characters' })
  token: string;
}
