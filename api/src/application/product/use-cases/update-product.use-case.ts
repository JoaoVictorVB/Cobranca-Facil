import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/entities/product.entity';
import {
    ProductAlreadyExistsError,
    ProductNotFoundError,
} from '../../../domain/product/errors/product.errors';
import { IProductRepository } from '../../../domain/product/repositories/product.repository.interface';

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<Product> {
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      throw new ProductNotFoundError(input.id);
    }

    // Se está atualizando o nome, verificar se já existe outro produto com esse nome
    if (input.name && input.name !== product.name) {
      const existingProducts = await this.productRepository.findAll();
      const nameExists = existingProducts.some(
        (p) =>
          p.name.toLowerCase() === input.name!.toLowerCase() &&
          p.id !== input.id,
      );

      if (nameExists) {
        throw new ProductAlreadyExistsError(input.name);
      }
    }

    // Atualizar produto usando o método update
    product.update({
      name: input.name,
      description: input.description,
    });

    return await this.productRepository.update(product);
  }
}
