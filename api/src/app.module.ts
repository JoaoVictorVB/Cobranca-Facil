import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './presentation/client/client.module';
import { ProductModule } from './presentation/product/product.module';
import { ReportsModule } from './presentation/reports/reports.module';
import { SaleModule } from './presentation/sale/sale.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
    SaleModule,
    ProductModule,
    ReportsModule,
  ],
})
export class AppModule {}
