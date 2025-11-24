import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './presentation/category/category.module';
import { ClientModule } from './presentation/client/client.module';
import { DistributionModule } from './presentation/distribution/distribution.module';
import { ProductModule } from './presentation/product/product.module';
import { ReportsModule } from './presentation/reports/reports.module';
import { RiskAnalyticsModule } from './presentation/risk-analytics/risk-analytics.module';
import { SaleModule } from './presentation/sale/sale.module';
import { TagModule } from './presentation/tag/tag.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
    SaleModule,
    ProductModule,
    CategoryModule,
    TagModule,
    DistributionModule,
    RiskAnalyticsModule,
    ReportsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
