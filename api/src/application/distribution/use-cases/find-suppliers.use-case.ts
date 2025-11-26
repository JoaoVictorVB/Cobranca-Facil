import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../common/use-case.interface';
import { BusinessRelationship } from '../../../domain/distribution/entities/business-relationship.entity';
import {
  BUSINESS_RELATIONSHIP_REPOSITORY,
  IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';

/**
 * Use Case: Find Suppliers
 * Lista os fornecedores conectados ao revendedor autenticado.
 */
@Injectable()
export class FindSuppliersUseCase implements IUseCase<string, BusinessRelationship[]> {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly businessRelationshipRepository: IBusinessRelationshipRepository,
  ) {}

  async execute(resellerId: string): Promise<BusinessRelationship[]> {
    return this.businessRelationshipRepository.findByReseller(resellerId);
  }
}
