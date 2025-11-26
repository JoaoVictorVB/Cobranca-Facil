import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedAccessError } from '../../../domain/distribution/errors/distribution.errors';
import { BUSINESS_RELATIONSHIP_REPOSITORY, IBusinessRelationshipRepository } from '../../../domain/distribution/repositories/business-relationship.repository.interface';
import { CheckRiskAssessment } from '../../../domain/risk-analytics/entities/check-risk-assessment.entity';
import { InvalidDateError } from '../../../domain/risk-analytics/errors/risk-analytics.errors';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CalculateSalesVelocityUseCase } from './calculate-sales-velocity.use-case';

interface AnalyzeCheckRiskRequest {
  resellerId: string;
  checkDate: Date;
  checkAmount: number;
}

@Injectable()
export class AnalyzeCheckRiskUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly relationshipRepository: IBusinessRelationshipRepository,
    private readonly calculateVelocity: CalculateSalesVelocityUseCase,
  ) {}

  async execute(
    request: AnalyzeCheckRiskRequest,
    supplierId: string,
  ): Promise<CheckRiskAssessment> {
    // Validate check date is in future
    const now = new Date();
    const checkDate = new Date(request.checkDate);

    if (checkDate <= now) {
      throw new InvalidDateError();
    }

    // Verify active relationship
    const relationship = await this.relationshipRepository.findActiveBySupplierAndReseller(
      supplierId,
      request.resellerId,
    );

    if (!relationship) {
      throw new UnauthorizedAccessError('No active relationship with this reseller');
    }

    // Calculate days until check
    const daysUntilCheck = Math.ceil((checkDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Get sales velocity (60-day average)
    const velocity = await this.calculateVelocity.execute(
      { resellerId: request.resellerId, days: 60 },
      supplierId,
    );

    // Project revenue until check date
    const projectedRevenue = velocity.projectRevenue(daysUntilCheck);

    // Calculate current stock value
    const products = await this.prisma.product.findMany({
      where: {
        userId: request.resellerId,
        originSupplierId: supplierId,
      },
      select: {
        stock: true,
        salePrice: true,
      },
    });

    const stockValue = products.reduce((sum, p) => sum + p.stock * p.salePrice, 0);

    // For now, assume current balance is 0 (would need banking integration)
    const currentBalance = 0;

    return CheckRiskAssessment.create({
      resellerId: request.resellerId,
      checkAmount: request.checkAmount,
      checkDate,
      currentBalance,
      projectedRevenue,
      stockValue,
      daysUntilCheck,
    });
  }
}
