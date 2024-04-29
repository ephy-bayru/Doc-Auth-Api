import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

interface LogMetadata {
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private winstonLogger: winston.Logger;
  private useNestLogger: boolean;

  constructor(private configService: ConfigService) {
    super(configService.get('APP_CONTEXT', 'Application'));
    // Determine whether to use NestJS's internal logger based on environment variable
    this.useNestLogger = this.configService.get('NEST_LOG') === 'on';
    this.initLogger();
  }

  private initLogger() {
    const environment = this.configService.get<string>(
      'NODE_ENV',
      'development',
    );
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');

    this.winstonLogger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'user-service', environment },
      transports: this.setupTransports(environment),
    });
  }

  private setupTransports(environment: string): winston.transport[] {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.simple(),
          nestWinstonModuleUtilities.format.nestLike(
            this.configService.get('APP_CONTEXT', 'Application'),
            {
              prettyPrint: true,
            },
          ),
        ),
      }),
    ];

    if (environment !== 'development') {
      transports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      );
    }

    return transports;
  }

  log(message: string, context?: string, meta?: LogMetadata) {
    if (this.useNestLogger) {
      super.log(message, context);
    } else {
      this.winstonLogger.info(message, { context, ...meta });
    }
  }

  error(
    message: string,
    trace?: unknown,
    context?: string,
    meta?: LogMetadata,
  ) {
    if (this.useNestLogger) {
      super.error(message, trace as string, context);
    } else {
      const traceMessage = trace instanceof Error ? trace.stack : trace;
      this.winstonLogger.error(message, {
        trace: traceMessage as string,
        context,
        ...meta,
      });
    }
  }

  warn(message: string, context?: string, meta?: LogMetadata) {
    if (this.useNestLogger) {
      super.warn(message, context);
    } else {
      this.winstonLogger.warn(message, { context, ...meta });
    }
  }

  debug(message: string, context?: string, meta?: LogMetadata) {
    if (this.useNestLogger) {
      super.debug(message, context);
    } else {
      this.winstonLogger.debug(message, { context, ...meta });
    }
  }

  verbose(message: string, context?: string, meta?: LogMetadata) {
    if (this.useNestLogger) {
      super.verbose(message, context);
    } else {
      this.winstonLogger.verbose(message, { context, ...meta });
    }
  }
}
