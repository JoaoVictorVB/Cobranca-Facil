import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Client } from '../../../domain/client/entities/client.entity';

export class ClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  referredBy?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  observation?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(client: Client): ClientResponseDto {
    return {
      id: client.id,
      name: client.name,
      phone: client.phone?.format(),
      referredBy: client.referredBy,
      address: client.address,
      observation: client.observation,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
