import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './presentation/client/client.module';
import { ProductModule } from './presentation/product/product.module';
import { CategoryModule } from './presentation/category/category.module';
import { ReportsModule } from './presentation/reports/reports.module';
import { SaleModule } from './presentation/sale/sale.module';
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
    ReportsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
