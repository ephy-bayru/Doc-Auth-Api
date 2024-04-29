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

  constructor(private configService: ConfigService) {
    super(configService.get('APP_CONTEXT', 'Application'));
    this.initLogger();
  }

  /**
   * Initializes the logger with configurations based on the environment.
   */
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

  /**
   * Configures the transports for Winston logger based on the environment.
   */
  private setupTransports(environment: string): winston.transport[] {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
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

  /**
   * Allows dynamic adjustment of the logger's level.
   */
  setLogLevel(level: string) {
    this.winstonLogger.level = level;
  }

  // Standardized log method with metadata handling
  private logWithMetadata(
    level: string,
    message: string,
    context: string,
    meta?: LogMetadata,
  ) {
    const logObject = { context, ...meta };
    this.winstonLogger.log(level, message, logObject);
  }

  log(message: string, context: string, meta?: LogMetadata) {
    super.log(message, context);
    this.logWithMetadata('info', message, context, meta);
  }

  error(
    message: string,
    trace: string | Error,
    context?: string,
    meta?: LogMetadata,
  ) {
    const traceMessage = trace instanceof Error ? trace.stack : trace;
    super.error(message, traceMessage, context);
    this.logWithMetadata('error', message, context, {
      trace: traceMessage,
      ...meta,
    });
  }

  warn(message: string, context: string, meta?: LogMetadata) {
    super.warn(message, context);
    this.logWithMetadata('warn', message, context, meta);
  }

  debug(message: string, context: string, meta?: LogMetadata) {
    super.debug(message, context);
    this.logWithMetadata('debug', message, context, meta);
  }

  verbose(message: string, context: string, meta?: LogMetadata) {
    super.verbose(message, context);
    this.logWithMetadata('verbose', message, context, meta);
  }
}
