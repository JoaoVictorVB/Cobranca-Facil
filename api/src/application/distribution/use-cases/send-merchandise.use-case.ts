import { Inject, Injectable } from '@nestjs/common';
import {
    StockTransfer,
    TransferItem,
} from '../../../domain/distribution/entities/stock-transfer.entity';
import {
    InsufficientStockError,
    RelationshipNotFoundError,
} from '../../../domain/distribution/errors/distribution.errors';
import {
    BUSINESS_RELATIONSHIP_REPOSITORY,
    IBusinessRelationshipRepository,
} from '../../../domain/distribution/repositories/business-relationship.repository.interface';
import {
    IStockTransferRepository,
    STOCK_TRANSFER_REPOSITORY,
} from '../../../domain/distribution/repositories/stock-transfer.repository.interface';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface SendMerchandiseRequest {
  resellerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  notes?: string;
}

@Injectable()
export class SendMerchandiseUseCase {
  constructor(
    @Inject(STOCK_TRANSFER_REPOSITORY)
    private readonly transferRepository: IStockTransferRepository,
    @Inject(BUSINESS_RELATIONSHIP_REPOSITORY)
    private readonly relationshipRepository: IBusinessRelationshipRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(request: SendMerchandiseRequest, supplierId: string): Promise<StockTransfer> {
    // Verify active relationship
    const relationship = await this.relationshipRepository.findActiveBySupplierAndReseller(
      supplierId,
      request.resellerId,
    );

    if (!relationship) {
      throw new RelationshipNotFoundError();
    }

    // 2. Execute in transaction
    return await this.prisma.$transaction(async (tx) => {
      const transferItems: TransferItem[] = [];

      // 3. Validate stock and prepare transfer items
      for (const item of request.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId, userId: supplierId },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new InsufficientStockError(product.name, product.stock, item.quantity);
        }

        transferItems.push({
          productId: product.id,
          quantity: item.quantity,
          name: product.name,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
        });

        // 4. Decrement supplier stock
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            userId: supplierId,
            type: 'saida',
            quantity: -item.quantity,
            previousStock: product.stock,
            newStock: product.stock - item.quantity,
            reason: `Transfer to reseller`,
            reference: `Reseller: ${request.resellerId}`,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 5. Create transfer entity and persist
      const transfer = StockTransfer.create(
        supplierId,
        request.resellerId,
        transferItems,
        request.notes,
      );

      return await this.transferRepository.create(transfer);
    });
  }
}
