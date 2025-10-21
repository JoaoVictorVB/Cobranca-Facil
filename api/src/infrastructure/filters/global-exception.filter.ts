import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/common/domain-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof DomainError) {
      this.logger.warn(`Domain Error: ${exception.error} - ${exception.message}`);

      return response.status(exception.httpStatusCode).json({
        statusCode: exception.httpStatusCode,
        error: exception.error,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      this.logger.warn(`HTTP Exception: ${status} - ${exception.message}`);

      return response.status(status).json({
        statusCode: status,
        error: exception.name,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    this.logger.error(
      `Unexpected Error: ${exception}`,
      exception instanceof Error ? exception.stack : '',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'InternalServerError',
      message: 'Ocorreu um erro interno no servidor',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
