import { DomainError } from '../../common/domain-error';
import { HttpStatusCode } from '../../common/http-status-code.enum';

export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super(
      `Produto com ID '${productId}' não foi encontrado`,
      HttpStatusCode.NOT_FOUND,
      'ProductNotFound',
    );
  }
}

export class ProductAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`Produto com nome '${name}' já existe`, HttpStatusCode.CONFLICT, 'ProductAlreadyExists');
  }
}
