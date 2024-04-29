import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { maskSensitiveData } from '../utils/mask-utils';
import * as crypto from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const correlationId =
      req.headers['x-request-id'] || this.generateCorrelationId();

    this.logRequest(req, correlationId);

    return next.handle().pipe(
      tap({
        next: (responseBody) =>
          this.logResponse(req, res, responseBody, start, correlationId),
        error: (error) =>
          this.handleError(req, res, error, start, correlationId),
      }),
    );
  }

  private logRequest(req: any, correlationId: string) {
    const { method, url, body, query, params, ip, headers } = req;
    const clientIp =
      ip || headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = headers['user-agent'] || 'unknown';

    this.logger.log('Incoming Request', `${method} ${url}`, {
      ip: clientIp,
      userAgent,
      body: maskSensitiveData(body),
      queryParams: maskSensitiveData(query),
      pathParams: maskSensitiveData(params),
      correlationId,
    });
  }

  private logResponse(
    req: any,
    res: any,
    responseBody: any,
    start: number,
    correlationId: string,
  ) {
    const { method, url } = req;
    const statusCode = res.statusCode;
    const delay = Date.now() - start;

    this.logger.log(
      'Outgoing Response',
      `${method} ${url} - Status: ${statusCode} - ${delay}ms`,
      {
        statusCode,
        delay,
        responseBody: responseBody
          ? maskSensitiveData(responseBody)
          : 'No Content',
        correlationId,
      },
    );
  }

  private handleError(
    req: any,
    res: any,
    error: any,
    start: number,
    correlationId: string,
  ) {
    const { method, url } = req;
    const delay = Date.now() - start;
    const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse =
      error instanceof HttpException ? error.getResponse() : error.message;

    this.logger.error(
      `${method} ${url} - Error: ${error.message} - ${delay}ms`,
      error.stack || 'No stack trace',
      'ErrorResponse',
      {
        error: maskSensitiveData(errorResponse),
        delay,
        statusCode,
        correlationId,
      },
    );

    // Rethrow the error if it's not a known HttpException
    if (!(error instanceof HttpException)) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateCorrelationId(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
