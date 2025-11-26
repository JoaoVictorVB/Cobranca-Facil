import { Inject, Injectable } from '@nestjs/common';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
    BUSINESS_RELATIONSHIP_REPOSITORY,
    IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

@Injectable()
export class AcceptRelationshipUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly repository: IBusinessRelationshipRepository,
  ) {}

  async execute(relationshipId: string, resellerId: string): Promise<BusinessRelationship> {
    const relationship = await this.repository.findById(relationshipId);

    if (!relationship) {
      throw new Error('Relationship not found');
    }

    if (relationship.resellerId !== resellerId) {
      throw new Error('Unauthorized: You cannot accept this relationship');
    }

    if (!relationship.isPending()) {
      throw new Error('Relationship is not pending');
    }

    relationship.accept();
    return await this.repository.update(relationship);
  }
}
