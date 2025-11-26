import {
    BusinessRelationship
} from '../entities/business-relationship.entity';

export const BUSINESS_RELATIONSHIP_REPOSITORY =
  'BUSINESS_RELATIONSHIP_REPOSITORY';

export interface IBusinessRelationshipRepository {
  create(relationship: BusinessRelationship): Promise<BusinessRelationship>;
  findById(id: string): Promise<BusinessRelationship | null>;
  findByInviteToken(token: string): Promise<BusinessRelationship | null>;
  findBySupplierAndReseller(
    supplierId: string,
    resellerId: string,
  ): Promise<BusinessRelationship | null>;
  findBySupplier(supplierId: string): Promise<BusinessRelationship[]>;
  findByReseller(resellerId: string): Promise<BusinessRelationship[]>;
  findActiveBySupplierAndReseller(
    supplierId: string,
    resellerId: string,
  ): Promise<BusinessRelationship | null>;
  update(relationship: BusinessRelationship): Promise<BusinessRelationship>;
  delete(id: string): Promise<void>;
}
