import { Module } from '@nestjs/common';
import { AddStockUseCase } from '../../application/product/use-cases/add-stock.use-case';
import { AdjustStockUseCase } from '../../application/product/use-cases/adjust-stock.use-case';
import { CreateProductUseCase } from '../../application/product/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../../application/product/use-cases/delete-product.use-case';
import { FindAllProductsUseCase } from '../../application/product/use-cases/find-all-products.use-case';
import { FindLowStockProductsUseCase } from '../../application/product/use-cases/find-low-stock-products.use-case';
import { FindProductByIdUseCase } from '../../application/product/use-cases/find-product-by-id.use-case';
import { GetStockMovementsUseCase } from '../../application/product/use-cases/get-stock-movements.use-case';
import { RemoveStockUseCase } from '../../application/product/use-cases/remove-stock.use-case';
import { UpdateProductUseCase } from '../../application/product/use-cases/update-product.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import {
  AddStockController,
  AdjustStockController,
  CreateProductController,
  DeleteProductController,
  GetAllProductsController,
  GetLowStockProductsController,
  GetProductByIdController,
  GetStockMovementsController,
  RemoveStockController,
  UpdateProductController,
} from './controllers';

@Module({
  controllers: [
    CreateProductController,
    GetAllProductsController,
    GetProductByIdController,
    UpdateProductController,
    DeleteProductController,
    AddStockController,
    RemoveStockController,
    AdjustStockController,
    GetLowStockProductsController,
    GetStockMovementsController,
  ],
  providers: [
    PrismaService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    AddStockUseCase,
    RemoveStockUseCase,
    AdjustStockUseCase,
    FindLowStockProductsUseCase,
    GetStockMovementsUseCase,
  ],
})
export class ProductModule {}
