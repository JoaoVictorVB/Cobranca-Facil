// Tipos de erros da API

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
    public path: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  // Helper methods
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isBadRequest(): boolean {
    return this.statusCode === 400;
  }

  isConflict(): boolean {
    return this.statusCode === 409;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isValidationError(): boolean {
    return this.statusCode === 422;
  }
}

// Códigos de erro específicos da API
export enum ApiErrorCode {
  // Client Errors
  CLIENT_NOT_FOUND = 'ClientNotFound',
  CLIENT_ALREADY_EXISTS = 'ClientAlreadyExists',
  INVALID_PHONE_NUMBER = 'InvalidPhoneNumber',
  CLIENT_HAS_DEPENDENCIES = 'ClientHasDependencies',

  // Sale Errors
  SALE_NOT_FOUND = 'SaleNotFound',
  INVALID_SALE_VALUE = 'InvalidSaleValue',
  INVALID_INSTALLMENT_NUMBER = 'InvalidInstallmentNumber',
  INSTALLMENT_NOT_FOUND = 'InstallmentNotFound',
  INSTALLMENT_ALREADY_PAID = 'InstallmentAlreadyPaid',
  INVALID_PAYMENT_AMOUNT = 'InvalidPaymentAmount',

  // Product Errors
  PRODUCT_NOT_FOUND = 'ProductNotFound',
  PRODUCT_ALREADY_EXISTS = 'ProductAlreadyExists',

  // Network Errors
  NETWORK_ERROR = 'NetworkError',
  TIMEOUT_ERROR = 'TimeoutError',
  UNKNOWN_ERROR = 'UnknownError',
}

// Helper para verificar tipo de erro
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

// Helper para obter mensagem amigável
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ocorreu um erro inesperado';
};

// Helper para verificar erro específico
export const isErrorCode = (error: unknown, code: ApiErrorCode): boolean => {
  if (isApiError(error)) {
    return error.errorCode === code;
  }
  return false;
};
