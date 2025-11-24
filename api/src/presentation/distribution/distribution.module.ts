import { Module } from '@nestjs/common';
import { AcceptMerchandiseUseCase } from '../../application/distribution/use-cases/accept-merchandise.use-case';
import { CreateRelationshipUseCase } from '../../application/distribution/use-cases/create-relationship.use-case';
import { FindResellersBySupplierUseCase } from '../../application/distribution/use-cases/find-resellers-by-supplier.use-case';
import { FindTransfersBySupplierUseCase } from '../../application/distribution/use-cases/find-transfers-by-supplier.use-case';
import { GetResellerInventoryUseCase } from '../../application/distribution/use-cases/get-reseller-inventory.use-case';
import { SendMerchandiseUseCase } from '../../application/distribution/use-cases/send-merchandise.use-case';
import { BUSINESS_RELATIONSHIP_REPOSITORY } from '../../domain/distribution/repositories/business-relationship.repository.interface';
import { STOCK_TRANSFER_REPOSITORY } from '../../domain/distribution/repositories/stock-transfer.repository.interface';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessRelationshipRepository } from '../../infrastructure/repositories/business-relationship.repository';
import { StockTransferRepository } from '../../infrastructure/repositories/stock-transfer.repository';
import {
    AcceptMerchandiseController,
    CreateRelationshipController,
    FindResellersController,
    FindTransfersController,
    GetResellerInventoryController,
    SendMerchandiseController,
} from './controllers';

@Module({
  controllers: [
    SendMerchandiseController,
    AcceptMerchandiseController,
    CreateRelationshipController,
    FindResellersController,
    GetResellerInventoryController,
    FindTransfersController,
  ],
  providers: [
    {
      provide: BUSINESS_RELATIONSHIP_REPOSITORY,
      useClass: BusinessRelationshipRepository,
    },
    {
      provide: STOCK_TRANSFER_REPOSITORY,
      useClass: StockTransferRepository,
    },
    PrismaService,
    SendMerchandiseUseCase,
    AcceptMerchandiseUseCase,
    CreateRelationshipUseCase,
    FindResellersBySupplierUseCase,
    GetResellerInventoryUseCase,
    FindTransfersBySupplierUseCase,
  ],
  exports: [BUSINESS_RELATIONSHIP_REPOSITORY, STOCK_TRANSFER_REPOSITORY],
})
export class DistributionModule {}
