import { DomainError } from '../../common/domain-error';
import { HttpStatusCode } from '../../common/http-status-code.enum';

export class ClientNotFoundError extends DomainError {
  constructor(clientId: string) {
    super(
      `Cliente com ID '${clientId}' não foi encontrado`,
      HttpStatusCode.NOT_FOUND,
      'ClientNotFound',
    );
  }
}

export class ClientAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`Cliente com nome '${name}' já existe`, HttpStatusCode.CONFLICT, 'ClientAlreadyExists');
  }
}

export class InvalidPhoneNumberError extends DomainError {
  constructor(phone: string) {
    super(
      `Número de telefone '${phone}' é inválido`,
      HttpStatusCode.BAD_REQUEST,
      'InvalidPhoneNumber',
    );
  }
}

export class ClientHasDependenciesError extends DomainError {
  constructor(clientId: string) {
    super(
      `Cliente '${clientId}' possui vendas associadas e não pode ser removido`,
      HttpStatusCode.CONFLICT,
      'ClientHasDependencies',
    );
  }
}
