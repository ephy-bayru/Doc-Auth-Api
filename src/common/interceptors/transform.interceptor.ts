import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const now = Date.now();
    const http: HttpArgumentsHost = context.switchToHttp();
    const request = http.getRequest();

    return next.handle().pipe(
      map((data) => ({
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          executionTime: `${Date.now() - now}ms`,
          method: request.method,
          path: request.url,
        },
      })),
    );
  }
}
