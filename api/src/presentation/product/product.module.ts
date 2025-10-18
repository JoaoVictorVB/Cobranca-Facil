import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '../../application/product/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../../application/product/use-cases/delete-product.use-case';
import { FindAllProductsUseCase } from '../../application/product/use-cases/find-all-products.use-case';
import { FindProductByIdUseCase } from '../../application/product/use-cases/find-product-by-id.use-case';
import { UpdateProductUseCase } from '../../application/product/use-cases/update-product.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [
    PrismaService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: CreateProductUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new CreateProductUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
    {
      provide: FindAllProductsUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new FindAllProductsUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
    {
      provide: FindProductByIdUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new FindProductByIdUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new UpdateProductUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new DeleteProductUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
  ],
})
export class ProductModule {}
