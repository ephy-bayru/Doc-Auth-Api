import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  // constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    // const userId = request.user?.id;
    // const action = `${request.method} ${request.route.path}`;

    return next.handle().pipe(
      tap(() => {
        // const details = { body: request.body, query: request.query };
        // this.auditLogService.recordEvent(action, userId, details);
      }),
    );
  }
}
