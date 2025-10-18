import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const startTime = Date.now();

    this.logger.log(`➡️  ${method} ${url}`);

    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(`Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log(`✅ ${method} ${url} - ${duration}ms`);
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.error(
            `❌ ${method} ${url} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
