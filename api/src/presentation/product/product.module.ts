import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '../../application/product/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../../application/product/use-cases/delete-product.use-case';
import { FindAllProductsUseCase } from '../../application/product/use-cases/find-all-products.use-case';
import { FindProductByIdUseCase } from '../../application/product/use-cases/find-product-by-id.use-case';
import { UpdateProductUseCase } from '../../application/product/use-cases/update-product.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import {
  CreateProductController,
  DeleteProductController,
  GetAllProductsController,
  GetProductByIdController,
  UpdateProductController,
} from './controllers';

@Module({
  controllers: [
    CreateProductController,
    GetAllProductsController,
    GetProductByIdController,
    UpdateProductController,
    DeleteProductController,
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
  ],
})
export class ProductModule {}
