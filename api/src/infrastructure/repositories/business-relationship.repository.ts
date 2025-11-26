import { Injectable } from '@nestjs/common';
import {
    BusinessRelationship,
    RelationshipStatus,
} from '../../domain/distribution/entities/business-relationship.entity';
import { IBusinessRelationshipRepository } from '../../domain/distribution/repositories/business-relationship.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BusinessRelationshipRepository implements IBusinessRelationshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(relationship: BusinessRelationship): Promise<BusinessRelationship> {
    const data = await this.prisma.businessRelationship.create({
      data: {
        id: relationship.id,
        supplierId: relationship.supplierId,
        resellerId: relationship.resellerId ?? null,
        status: relationship.status,
        inviteToken: relationship.inviteToken ?? null,
        createdAt: relationship.createdAt,
        acceptedAt: relationship.acceptedAt ?? null,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<BusinessRelationship | null> {
    const data = await this.prisma.businessRelationship.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findByInviteToken(token: string): Promise<BusinessRelationship | null> {
    const data = await this.prisma.businessRelationship.findFirst({
      where: { inviteToken: token },
    });

    return data ? this.toDomain(data) : null;
  }

  async findBySupplierAndReseller(
    supplierId: string,
    resellerId: string,
  ): Promise<BusinessRelationship | null> {
    const data = await this.prisma.businessRelationship.findUnique({
      where: {
        supplierId_resellerId: { supplierId, resellerId },
      },
    });

    return data ? this.toDomain(data) : null;
  }

  async findBySupplier(supplierId: string): Promise<BusinessRelationship[]> {
    const data = await this.prisma.businessRelationship.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) => this.toDomain(item));
  }

  async findByReseller(resellerId: string): Promise<BusinessRelationship[]> {
    const data = await this.prisma.businessRelationship.findMany({
      where: { resellerId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) => this.toDomain(item));
  }

  async findActiveBySupplierAndReseller(
    supplierId: string,
    resellerId: string,
  ): Promise<BusinessRelationship | null> {
    const data = await this.prisma.businessRelationship.findFirst({
      where: {
        supplierId,
        resellerId,
        status: 'ATIVO',
      },
    });

    return data ? this.toDomain(data) : null;
  }

  async update(relationship: BusinessRelationship): Promise<BusinessRelationship> {
    const data = await this.prisma.businessRelationship.update({
      where: { id: relationship.id },
      data: {
        resellerId: relationship.resellerId ?? null,
        status: relationship.status,
        inviteToken: relationship.inviteToken ?? null,
        acceptedAt: relationship.acceptedAt ?? null,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.businessRelationship.delete({ where: { id } });
  }

  private toDomain(data: any): BusinessRelationship {
    return BusinessRelationship.reconstitute({
      id: data.id,
      supplierId: data.supplierId,
      resellerId: data.resellerId,
      status: data.status as RelationshipStatus,
      inviteToken: data.inviteToken,
      createdAt: data.createdAt,
      acceptedAt: data.acceptedAt,
    });
  }
}
