import { Inject, Injectable } from '@nestjs/common';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
  BUSINESS_RELATIONSHIP_REPOSITORY,
  IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

@Injectable()
export class GenerateInviteTokenUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly repository: IBusinessRelationshipRepository,
  ) {}

  async execute(supplierId: string): Promise<BusinessRelationship> {
    // Generate a new relationship with invite token
    const relationship = BusinessRelationship.createWithToken(supplierId);
    
    return await this.repository.create(relationship);
  }
}
