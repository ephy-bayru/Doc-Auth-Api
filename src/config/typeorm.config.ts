import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { DatabaseLoggerService } from 'src/core/services/database-logger.service';

function prepareSslOptions(
  configService: ConfigService,
): { rejectUnauthorized: boolean; ca?: string } | null {
  const useSSL = configService.get<boolean>('DB_SSL', false);
  if (!useSSL) {
    console.log('Database connection SSL is disabled.');
    return null;
  }

  const rejectUnauthorized = configService.get<boolean>(
    'DB_SSL_REJECT_UNAUTHORIZED',
    true,
  );
  const sslCertPath = configService.get<string>('DB_SSL_CERT_PATH', '');

  if (sslCertPath) {
    try {
      const ca = fs.readFileSync(sslCertPath, 'utf8');
      return { rejectUnauthorized, ca };
    } catch (error) {
      console.error(
        `Error loading SSL certificate from path "${sslCertPath}":`,
        error,
      );
      return { rejectUnauthorized };
    }
  }

  return { rejectUnauthorized };
}

export const typeormConfig = (
  configService: ConfigService,
  databaseLoggerService: DatabaseLoggerService,
): TypeOrmModuleOptions => {
  const sslOptions = prepareSslOptions(configService);
  const loggingOptions =
    databaseLoggerService.determineDatabaseLoggingOptions();
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [
      configService.get<string>(
        'TYPEORM_ENTITIES',
        isProduction ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts',
      ),
    ],
    migrations: [
      configService.get<string>(
        'TYPEORM_MIGRATIONS',
        isProduction ? 'dist/migrations/*.js' : 'src/migrations/*.ts',
      ),
    ],
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('TYPEORM_SYNC', !isProduction),
    migrationsRun: configService.get<boolean>('TYPEORM_MIGRATIONS_RUN', true),
    logging: loggingOptions,
    ssl: sslOptions,
    extra: {
      connectionTimeoutMillis: configService.get<number>(
        'DB_CONNECTION_TIMEOUT',
        3000,
      ),
    },
  };
};
