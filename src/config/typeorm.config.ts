import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/services/logger.service';
import { LoggerOptions } from 'typeorm';

/**
 * Prepares SSL options for the database connection.
 * @param configService The configuration service to access environment variables.
 * @returns An object with SSL configuration or null.
 */
function prepareSslOptions(
  configService: ConfigService,
): { rejectUnauthorized: boolean } | null {
  const useSSL = configService.get<boolean>('DB_SSL', false);
  return useSSL
    ? {
        rejectUnauthorized: configService.get<boolean>(
          'DB_SSL_REJECT_UNAUTHORIZED',
          true,
        ),
      }
    : null;
}

export const typeormConfig = (
  configService: ConfigService,
  loggerService?: LoggerService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const sslOptions = prepareSslOptions(configService);

  const loggingOptions: LoggerOptions = loggerService
    ? loggerService.determineLoggingOptions(configService)
    : ['error'];

  const entitiesPath = isProduction
    ? 'dist/**/*.entity.js'
    : 'src/**/*.entity.ts';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [entitiesPath],
    synchronize: !isProduction,
    logging: loggingOptions,
    ssl: sslOptions,
    extra: {
      connectionTimeoutMillis: configService.get<number>(
        'DB_CONNECTION_TIMEOUT',
        30000,
      ),
    },
  };
};
