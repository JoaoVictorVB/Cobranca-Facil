import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedAccessError } from '../../../domain/distribution/errors/distribution.errors';
import { BUSINESS_RELATIONSHIP_REPOSITORY, IBusinessRelationshipRepository } from '../../../domain/distribution/repositories/business-relationship.repository.interface';
import { SalesVelocity } from '../../../domain/risk-analytics/entities/sales-velocity.entity';
import { InsufficientDataError } from '../../../domain/risk-analytics/errors/risk-analytics.errors';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

interface CalculateSalesVelocityRequest {
  resellerId: string;
  days?: number;
}

@Injectable()
export class CalculateSalesVelocityUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly relationshipRepository: IBusinessRelationshipRepository,
  ) {}

  async execute(
    request: CalculateSalesVelocityRequest,
    supplierId: string,
  ): Promise<SalesVelocity> {
    const periodDays = request.days ?? 60;

    // Verify active relationship
    const relationship = await this.relationshipRepository.findActiveBySupplierAndReseller(
      supplierId,
      request.resellerId,
    );

    if (!relationship) {
      throw new UnauthorizedAccessError('No active relationship with this reseller');
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get sales in period
    const sales = await this.prisma.sale.findMany({
      where: {
        userId: request.resellerId,
        saleDate: {
          gte: startDate,
        },
      },
      select: {
        totalValue: true,
      },
    });

    if (sales.length === 0) {
      throw new InsufficientDataError(`No sales found in the last ${periodDays} days`);
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
    const dailyAverage = totalRevenue / periodDays;

    return SalesVelocity.create({
      resellerId: request.resellerId,
      periodDays,
      totalRevenue,
      dailyAverage,
      transactionCount: sales.length,
    });
  }
}
