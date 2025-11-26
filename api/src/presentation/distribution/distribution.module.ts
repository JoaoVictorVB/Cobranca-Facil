import { Module } from '@nestjs/common';
import { AcceptByTokenUseCase } from '../../application/distribution/use-cases/accept-by-token.use-case';
import { AcceptMerchandiseUseCase } from '../../application/distribution/use-cases/accept-merchandise.use-case';
import { AcceptRelationshipUseCase } from '../../application/distribution/use-cases/accept-relationship.use-case';
import { CreateRelationshipUseCase } from '../../application/distribution/use-cases/create-relationship.use-case';
import { FindPendingRelationshipsUseCase } from '../../application/distribution/use-cases/find-pending-relationships.use-case';
import { FindResellersBySupplierUseCase } from '../../application/distribution/use-cases/find-resellers-by-supplier.use-case';
import { FindSuppliersUseCase } from '../../application/distribution/use-cases/find-suppliers.use-case';
import { GenerateInviteTokenUseCase } from '../../application/distribution/use-cases/generate-invite-token.use-case';
import { FindTransfersBySupplierUseCase } from '../../application/distribution/use-cases/find-transfers-by-supplier.use-case';
import { GetResellerInventoryUseCase } from '../../application/distribution/use-cases/get-reseller-inventory.use-case';
import { SendMerchandiseUseCase } from '../../application/distribution/use-cases/send-merchandise.use-case';
import { BUSINESS_RELATIONSHIP_REPOSITORY } from '../../domain/distribution/repositories/business-relationship.repository.interface';
import { STOCK_TRANSFER_REPOSITORY } from '../../domain/distribution/repositories/stock-transfer.repository.interface';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessRelationshipRepository } from '../../infrastructure/repositories/business-relationship.repository';
import { StockTransferRepository } from '../../infrastructure/repositories/stock-transfer.repository';
import {
    AcceptByTokenController,
    AcceptMerchandiseController,
    AcceptRelationshipController,
    CreateRelationshipController,
    FindPendingRelationshipsController,
    FindResellersController,
    FindSuppliersController,
    FindTransfersController,
    GenerateInviteTokenController,
    GetResellerInventoryController,
    SendMerchandiseController,
} from './controllers';

@Module({
  controllers: [
    SendMerchandiseController,
    AcceptMerchandiseController,
    CreateRelationshipController,
    AcceptRelationshipController,
    FindPendingRelationshipsController,
    GenerateInviteTokenController,
    AcceptByTokenController,
    FindResellersController,
    FindSuppliersController,
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
    AcceptRelationshipUseCase,
    FindPendingRelationshipsUseCase,
    GenerateInviteTokenUseCase,
    AcceptByTokenUseCase,
    FindResellersBySupplierUseCase,
    FindSuppliersUseCase,
    GetResellerInventoryUseCase,
    FindTransfersBySupplierUseCase,
  ],
  exports: [BUSINESS_RELATIONSHIP_REPOSITORY, STOCK_TRANSFER_REPOSITORY],
})
export class DistributionModule {}
