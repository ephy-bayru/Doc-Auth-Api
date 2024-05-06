import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly rateLimiter: RateLimiterMemory;

  constructor(private readonly logger: LoggerService) {
    this.rateLimiter = new RateLimiterMemory({
      keyPrefix: 'rateLimit',
      points: 5,
      duration: 1,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = `${request.ip}-${request.method}-${request.path}`;

    return new Observable((observer) => {
      this.rateLimiter
        .consume(key)
        .then(() => {
          next.handle().subscribe({
            next: (result) => {
              observer.next(result);
              observer.complete();
            },
            error: (err) => observer.error(err),
          });
        })
        .catch((rateLimiterError) => {
          const errorMessage = 'Too many requests';
          this.logger.error(
            `Rate limit exceeded for ${key}: ${errorMessage}`,
            rateLimiterError.stack,
            'RateLimitInterceptor',
          );
          observer.error(
            new HttpException(errorMessage, HttpStatus.TOO_MANY_REQUESTS),
          );
        });
    }).pipe(
      catchError((err) => {
        this.logger.error(
          `Error occurred during rate limited operation for ${key}`,
          err.stack,
          'RateLimitInterceptor',
        );
        return throwError(() => err);
      }),
    );
  }
}
