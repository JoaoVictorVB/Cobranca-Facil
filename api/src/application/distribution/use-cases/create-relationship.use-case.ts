import { Inject, Injectable } from '@nestjs/common';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
    BUSINESS_RELATIONSHIP_REPOSITORY,
    IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

@Injectable()
export class CreateRelationshipUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly repository: IBusinessRelationshipRepository,
  ) {}

  async execute(supplierId: string, resellerId: string): Promise<BusinessRelationship> {
    // Check if relationship already exists
    const existing = await this.repository.findBySupplierAndReseller(
      supplierId,
      resellerId,
    );

    if (existing) {
      throw new Error('Relationship already exists');
    }

    const relationship = BusinessRelationship.create(supplierId, resellerId);
    return await this.repository.create(relationship);
  }
}
