import { Inject, Injectable } from '@nestjs/common';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
  BUSINESS_RELATIONSHIP_REPOSITORY,
  IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

@Injectable()
export class AcceptByTokenUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly repository: IBusinessRelationshipRepository,
  ) {}

  async execute(token: string, resellerId: string): Promise<BusinessRelationship> {
    const relationship = await this.repository.findByInviteToken(token);

    if (!relationship) {
      throw new Error('Invalid invite token');
    }

    if (relationship.resellerId && relationship.resellerId !== '') {
      throw new Error('Token already used');
    }

    if (!relationship.isPending()) {
      throw new Error('Relationship is not pending');
    }

    // Check if reseller already has relationship with this supplier
    const existing = await this.repository.findBySupplierAndReseller(
      relationship.supplierId,
      resellerId,
    );

    if (existing) {
      throw new Error('Relationship already exists with this supplier');
    }

    // Set reseller and accept
    relationship.setReseller(resellerId);
    relationship.accept();

    return await this.repository.update(relationship);
  }
}
