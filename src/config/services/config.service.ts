import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  private dbHost: string;
  private dbPort: number;
  private dbUsername: string;
  private dbPassword: string;
  private dbName: string;
  private dbSSL: boolean;
  private dbSSLRejectUnauthorized: boolean;
  private externalServiceUrl: string;
  private typeormSync: boolean;
  private typeormMigrationsRun: boolean;
  private typeormMigrations: string;
  private typeormEntities: string;
  private requestTimeoutMs: number;

  constructor(private configService: ConfigService) {
    this.loadConfigurations();
  }

  private loadConfigurations() {
    this.dbHost = this.configService.get<string>('DB_HOST', 'localhost');
    this.dbPort = this.configService.get<number>('DB_PORT', 5432);
    this.dbUsername = this.configService.get<string>('DB_USERNAME', 'postgres');
    this.dbPassword = this.configService.get<string>('DB_PASSWORD', 'password');
    this.dbName = this.configService.get<string>('DB_NAME', 'doc-auth-dev');
    this.dbSSL = this.configService.get<boolean>('DB_SSL', false);
    this.dbSSLRejectUnauthorized = this.configService.get<boolean>(
      'DB_SSL_REJECT_UNAUTHORIZED',
      true,
    );
    this.externalServiceUrl = this.configService.get<string>(
      'EXTERNAL_SERVICE_URL',
      'https://ephrembayru.com',
    );
    this.typeormSync = this.configService.get<boolean>('TYPEORM_SYNC', false);
    this.typeormMigrationsRun = this.configService.get<boolean>(
      'TYPEORM_MIGRATIONS_RUN',
      false,
    );
    this.typeormMigrations = this.configService.get<string>(
      'TYPEORM_MIGRATIONS',
      'dist/migrations/*{.ts,.js}',
    );
    this.typeormEntities = this.configService.get<string>(
      'TYPEORM_ENTITIES',
      'dist/**/*.entity{.ts,.js}',
    );
    this.requestTimeoutMs = this.configService.get<number>(
      'REQUEST_TIMEOUT_MS',
      5000,
    );
  }

  getDatabaseConfig() {
    return {
      host: this.dbHost,
      port: this.dbPort,
      username: this.dbUsername,
      password: this.dbPassword,
      database: this.dbName,
      ssl: this.dbSSL
        ? { rejectUnauthorized: this.dbSSLRejectUnauthorized }
        : undefined,
    };
  }

  getExternalServiceUrl(): string {
    return this.externalServiceUrl;
  }

  getTypeormConfig() {
    return {
      synchronize: this.typeormSync,
      migrationsRun: this.typeormMigrationsRun,
      migrations: this.typeormMigrations,
      entities: this.typeormEntities,
    };
  }

  getRequestTimeoutMs(): number {
    return this.requestTimeoutMs;
  }

  getApiDefaultVersion(): string {
    return this.configService.get<string>('API_DEFAULT_VERSION', '1');
  }
}
