import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '../services/logger.service';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const responseContent = exception.getResponse();
      if (
        typeof responseContent === 'object' &&
        responseContent.hasOwnProperty('message')
      ) {
        message = responseContent['message'];
      } else if (typeof responseContent === 'string') {
        message = responseContent;
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    this.logger.error(
      'Exception caught in HttpExceptionFilter',
      exception instanceof Error ? exception.stack : '',
      'HttpExceptionFilter',
      {
        ip: request.ip,
        method: request.method,
        url: request.url,
        body: request.body,
        status,
        exception: errorResponse,
      },
    );

    response.status(status).json(errorResponse);
  }
}
