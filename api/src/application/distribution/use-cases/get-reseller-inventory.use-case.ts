import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedAccessError } from '../../../domain/distribution/errors/distribution.errors';
import {
    BUSINESS_RELATIONSHIP_REPOSITORY,
    IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface ResellerProductInfo {
  id: string;
  name: string;
  stock: number;
  salePrice: number;
  lastSaleDate?: Date;
  daysSinceLastSale?: number;
}

@Injectable()
export class GetResellerInventoryUseCase {
  constructor(
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly relationshipRepository: IBusinessRelationshipRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(resellerId: string, supplierId: string): Promise<ResellerProductInfo[]> {
    // Verify active relationship
    const relationship = await this.relationshipRepository.findActiveBySupplierAndReseller(
      supplierId,
      resellerId,
    );

    if (!relationship) {
      throw new UnauthorizedAccessError('No active relationship with this reseller');
    }

    // Get products that originated from this supplier
    const products = await this.prisma.product.findMany({
      where: {
        userId: resellerId,
        originSupplierId: supplierId, // CRITICAL: Only see your products
      },
      include: {
        stockMovements: {
          where: { type: 'venda' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return products.map((product) => {
      const lastSale = product.stockMovements[0];
      const lastSaleDate = lastSale?.createdAt;
      const daysSinceLastSale = lastSaleDate
        ? Math.floor((Date.now() - lastSaleDate.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;

      return {
        id: product.id,
        name: product.name,
        stock: product.stock,
        salePrice: product.salePrice,
        lastSaleDate,
        daysSinceLastSale,
      };
    });
  }
}
