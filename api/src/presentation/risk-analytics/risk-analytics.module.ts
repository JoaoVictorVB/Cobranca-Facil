import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DistributionModule } from '../distribution/distribution.module';

// Use Cases
import { AnalyzeCheckRiskUseCase } from '../../application/risk-analytics/use-cases/analyze-check-risk.use-case';
import { CalculateSalesVelocityUseCase } from '../../application/risk-analytics/use-cases/calculate-sales-velocity.use-case';

// Controllers
import {
    AnalyzeCheckRiskController,
    CalculateSalesVelocityController,
} from './controllers';

@Module({
  imports: [DistributionModule],
  controllers: [CalculateSalesVelocityController, AnalyzeCheckRiskController],
  providers: [
    PrismaService,
    CalculateSalesVelocityUseCase,
    AnalyzeCheckRiskUseCase,
  ],
  exports: [],
})
export class RiskAnalyticsModule {}
