import { Inject, Injectable } from '@nestjs/common';
import { StockTransfer } from '../../../domain/distribution/entities/stock-transfer.entity';
import {
    InvalidTransferStatusError,
    TransferNotFoundError,
} from '../../../domain/distribution/errors/distribution.errors';
import {
    IStockTransferRepository,
    STOCK_TRANSFER_REPOSITORY,
} from '../../../domain/distribution/repositories/stock-transfer.repository.interface';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AcceptMerchandiseUseCase {
  constructor(
    @Inject(STOCK_TRANSFER_REPOSITORY)
    private readonly transferRepository: IStockTransferRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(transferId: string, resellerId: string): Promise<StockTransfer> {
    const transfer = await this.transferRepository.findById(transferId);

    if (!transfer) {
      throw new TransferNotFoundError(transferId);
    }

    if (transfer.resellerId !== resellerId) {
      throw new Error('Unauthorized: This transfer does not belong to you');
    }

    if (transfer.status !== 'ENVIADO') {
      throw new InvalidTransferStatusError('Only sent transfers can be accepted');
    }

    // Execute in transaction
    return await this.prisma.$transaction(async (tx) => {
      // Create products in reseller's account
      for (const item of transfer.items) {
        const createdProduct = await tx.product.create({
          data: {
            userId: resellerId,
            name: item.name,
            costPrice: item.costPrice,
            salePrice: item.salePrice,
            stock: item.quantity,
            originProductId: item.productId,
            originSupplierId: transfer.supplierId,
            isActive: true,
          },
        });

        // Create stock movement for reseller
        await tx.stockMovement.create({
          data: {
            productId: createdProduct.id,
            userId: resellerId,
            type: 'entrada',
            quantity: item.quantity,
            previousStock: 0,
            newStock: item.quantity,
            reason: 'Received from supplier',
            reference: `Transfer: ${transferId}`,
          },
        });
      }

      // Mark transfer as received
      transfer.markAsReceived();
      return await this.transferRepository.update(transfer);
    });
  }
}
