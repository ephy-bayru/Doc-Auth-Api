import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';
import { serialize } from '../utils/serialization-utils';

type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'verbose';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService<T = any> extends ConsoleLogger {
  private logLevelPriority = {
    error: 0,
    warn: 1,
    log: 2,
    debug: 3,
    verbose: 4,
  };

  private currentLogLevel: LogLevel;

  constructor(context?: string) {
    super(context);
    this.currentLogLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL as LogLevel;
    return this.logLevelPriority.hasOwnProperty(level) ? level : 'log';
  }

  public setLogLevel(level: LogLevel) {
    if (this.logLevelPriority.hasOwnProperty(level)) {
      this.currentLogLevel = level;
      this.log(`Log level set to ${level}`, this.context);
    } else {
      this.error(
        `Attempted to set an unsupported log level: ${level}`,
        '',
        this.context,
      );
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.logLevelPriority[level] <=
      this.logLevelPriority[this.currentLogLevel]
    );
  }

  private formatLogMessage(
    level: LogLevel,
    message: string,
    data?: Partial<T>,
  ): string {
    const timestamp = new Date().toISOString();
    const serializedData = data ? ` - Data: ${serialize(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${
      this.context
    }] ${message}${serializedData}`;
  }

  private logMessage(
    level: LogLevel,
    message: string,
    data?: Partial<T>,
    trace?: string,
  ) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatLogMessage(level, message, data);
    super[level](formattedMessage, trace);
  }

  logInfo(message: string, data?: Partial<T>) {
    this.logMessage('log', message, data);
  }

  logWarn(message: string, data?: Partial<T>) {
    this.logMessage('warn', message, data);
  }

  logError(message: string, data?: Partial<T>, trace?: string) {
    this.logMessage('error', message, data, trace);
  }

  logDebug(message: string, data?: Partial<T>) {
    this.logMessage('debug', message, data);
  }

  logVerbose(message: string, data?: Partial<T>) {
    this.logMessage('verbose', message, data);
  }
}
