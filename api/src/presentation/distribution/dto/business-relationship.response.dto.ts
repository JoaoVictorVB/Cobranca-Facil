import { ApiProperty } from '@nestjs/swagger';
import { RelationshipStatus } from '../../../domain/distribution/entities/business-relationship.entity';

export class BusinessRelationshipResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  supplierId: string;

  @ApiProperty()
  resellerId: string;

  @ApiProperty({ enum: RelationshipStatus })
  status: RelationshipStatus;

  @ApiProperty({ required: false })
  inviteToken?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  acceptedAt?: Date;

  @ApiProperty({ required: false })
  supplierName?: string;

  @ApiProperty({ required: false })
  resellerName?: string;

  static fromDomain(relationship: any, supplierName?: string, resellerName?: string): BusinessRelationshipResponseDto {
    return {
      id: relationship.id,
      supplierId: relationship.supplierId,
      resellerId: relationship.resellerId,
      status: relationship.status,
      inviteToken: relationship.inviteToken,
      createdAt: relationship.createdAt,
      acceptedAt: relationship.acceptedAt,
      supplierName,
      resellerName,
    };
  }
}
