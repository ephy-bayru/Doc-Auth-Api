import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/services/logger.service';
import { LoggerOptions } from 'typeorm';
import * as fs from 'fs';

/**
 * Prepares SSL options for the database connection.
 * @param configService The configuration service to access environment variables.
 * @returns An object with SSL configuration.
 */
function prepareSslOptions(
  configService: ConfigService,
): { rejectUnauthorized: boolean; ca?: string } | null {
  const useSSL = configService.get<boolean>('DB_SSL', false);
  if (!useSSL) {
    // If SSL is not enabled, skip loading the certificate
    return null;
  }

  // Use the absolute path from the environment variable
  const sslCertPath = configService.get<string>('DB_SSL_CERT_PATH');
  if (!sslCertPath) {
    console.error(
      'SSL certificate path (DB_SSL_CERT_PATH) is not defined in the environment variables.',
    );
    return null; // Or handle as appropriate for your application
  }

  const rejectUnauthorized = configService.get<boolean>(
    'DB_SSL_REJECT_UNAUTHORIZED',
    true,
  );

  const sslOptions: { rejectUnauthorized: boolean; ca?: string } = {
    rejectUnauthorized,
  };

  try {
    sslOptions.ca = fs.readFileSync(sslCertPath, 'utf8');
  } catch (error) {
    console.error(`Failed to load SSL certificate from ${sslCertPath}:`, error);
    // Error handling or further actions as necessary
  }

  return sslOptions;
}

/**
 * Generates the TypeORM module options with advanced configuration,
 * including SSL, logging, and migrations setup.
 * @param configService The configuration service used for accessing environment variables.
 * @param loggerService Optional custom logger service for TypeORM logging.
 * @returns TypeOrmModuleOptions with advanced settings.
 */
export const typeormConfig = (
  configService: ConfigService,
  loggerService?: LoggerService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const sslOptions = prepareSslOptions(configService);

  // Fetch logging level or options from environment or use custom logger service
  const loggingOptions: LoggerOptions = loggerService
    ? loggerService.determineLoggingOptions(configService)
    : 'all';

  // Fetch paths for entities and migrations from environment variables
  // with fallbacks to support both development and production environments
  const entities = configService.get<string>(
    'TYPEORM_ENTITIES',
    isProduction ? 'dist/**/*.entity{.ts,.js}' : 'src/**/*.entity{.ts,.js}',
  );
  const migrations = configService.get<string>(
    'TYPEORM_MIGRATIONS',
    isProduction ? 'dist/migrations/*{.ts,.js}' : 'src/migrations/*{.ts,.js}',
  );

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [entities],
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('TYPEORM_SYNC', !isProduction),
    migrationsRun: configService.get<boolean>('TYPEORM_MIGRATIONS_RUN', true),
    migrations: [migrations],
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
