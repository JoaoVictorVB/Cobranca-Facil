import { HttpStatusCode } from './http-status-code.enum';

export abstract class DomainError extends Error {
  readonly message: string;
  readonly httpStatusCode: HttpStatusCode;
  readonly error: string;

  constructor(message: string, httpStatusCode: HttpStatusCode, error: string) {
    super(message);
    this.message = message;
    this.httpStatusCode = httpStatusCode;
    this.error = error;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
