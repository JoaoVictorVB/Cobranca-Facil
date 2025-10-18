import { DomainError } from '../../common/domain-error';
import { HttpStatusCode } from '../../common/http-status-code.enum';

export class SaleNotFoundError extends DomainError {
  constructor(saleId: string) {
    super(
      `Venda com ID '${saleId}' não foi encontrada`,
      HttpStatusCode.NOT_FOUND,
      'SaleNotFound',
    );
  }
}

export class InvalidSaleValueError extends DomainError {
  constructor(value: number) {
    super(
      `Valor da venda '${value}' é inválido. Deve ser maior que zero`,
      HttpStatusCode.BAD_REQUEST,
      'InvalidSaleValue',
    );
  }
}

export class InvalidInstallmentNumberError extends DomainError {
  constructor(installments: number) {
    super(
      `Número de parcelas '${installments}' é inválido. Deve ser entre 1 e 24`,
      HttpStatusCode.BAD_REQUEST,
      'InvalidInstallmentNumber',
    );
  }
}

export class InstallmentNotFoundError extends DomainError {
  constructor(installmentId: string) {
    super(
      `Parcela com ID '${installmentId}' não foi encontrada`,
      HttpStatusCode.NOT_FOUND,
      'InstallmentNotFound',
    );
  }
}

export class InstallmentAlreadyPaidError extends DomainError {
  constructor(installmentId: string) {
    super(
      `Parcela '${installmentId}' já foi paga`,
      HttpStatusCode.CONFLICT,
      'InstallmentAlreadyPaid',
    );
  }
}

export class InvalidPaymentAmountError extends DomainError {
  constructor(amount: number, expected: number) {
    super(
      `Valor do pagamento '${amount}' é diferente do valor esperado '${expected}'`,
      HttpStatusCode.BAD_REQUEST,
      'InvalidPaymentAmount',
    );
  }
}
