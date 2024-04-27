import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerOptions, LogLevel } from 'typeorm';

@Injectable()
export class DatabaseLoggerService {
  private readonly validOptions: LogLevel[] = [
    'query', // Controls query logging
    'error', // Controls error logging
    'schema', // Controls schema build process logging
    'warn', // Controls warning type messages logging
    'info', // Controls basic flow information logging
    'log', // General information logging
    'migration', // Controls migration process logging
  ];

  constructor(private configService: ConfigService) {}

  /**
   * Determines the appropriate TypeORM logging configuration based on environment settings.
   * Allows flexibility and dynamic adjustment based on operational needs.
   */
  public determineDatabaseLoggingOptions(): LoggerOptions {
    const loggingConfig = this.configService.get<string>('DB_LOGGING', 'false');

    if (loggingConfig === 'false') return false;
    if (loggingConfig === 'true' || loggingConfig === 'all') return 'all';

    const options = loggingConfig.split(',');
    const filteredOptions: LogLevel[] = options.filter((option) =>
      this.isValidLogLevel(option),
    ) as LogLevel[];

    return filteredOptions.length > 0 ? filteredOptions : false;
  }

  /**
   * Validates if a provided logging level string is a valid TypeORM LogLevel.
   * Enhances flexibility by validating against a predefined list of valid log levels.
   */
  private isValidLogLevel(level: string): level is LogLevel {
    return this.validOptions.includes(level as LogLevel);
  }
}
