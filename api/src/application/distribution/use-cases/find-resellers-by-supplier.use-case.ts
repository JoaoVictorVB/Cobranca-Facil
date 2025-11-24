import { Inject, Injectable } from '@nestjs/common';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
    BUSINESS_RELATIONSHIP_REPOSITORY,
    IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

@Injectable()
export class FindResellersBySupplierUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly repository: IBusinessRelationshipRepository,
  ) {}

  async execute(supplierId: string): Promise<BusinessRelationship[]> {
    return await this.repository.findBySupplier(supplierId);
  }
}
