import { Inject, Injectable } from '@nestjs/common';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
  BUSINESS_RELATIONSHIP_REPOSITORY,
  IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

@Injectable()
export class FindPendingRelationshipsUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly repository: IBusinessRelationshipRepository,
  ) {}

  async execute(resellerId: string): Promise<BusinessRelationship[]> {
    const relationships = await this.repository.findByReseller(resellerId);
    
    // Filter only pending relationships
    return relationships.filter(rel => rel.isPending());
  }
}
