import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { CustomConfigService } from 'src/config/services/config.service';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs: number;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: CustomConfigService,
  ) {
    this.timeoutMs = +this.configService.getRequestTimeoutMs();
    this.logger.log(`TimeoutInterceptor: Timeout set to ${this.timeoutMs}ms`);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    // Log the timeout value
    this.logger.log(
      `Applying timeout of ${this.timeoutMs} ms to ${method} ${url}`,
    );

    // Ensure timeoutMs is a number
    if (typeof this.timeoutMs !== 'number' || isNaN(this.timeoutMs)) {
      const errorMsg = `Invalid timeout value: ${this.timeoutMs}`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        this.logger.error(
          `Error after timeout in ${method} ${url}: ${err.message}`,
          {
            error: err,
            method,
            url,
            timeout: this.timeoutMs,
          },
        );
        return throwError(
          () =>
            new RequestTimeoutException(
              `Request to ${method} ${url} timed out after ${this.timeoutMs}ms`,
            ),
        );
      }),
    );
  }
}
