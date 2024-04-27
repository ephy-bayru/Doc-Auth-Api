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

  constructor(private configService: ConfigService) {
    this.dbHost = this.configService.get<string>('DB_HOST');
    this.dbPort = this.configService.get<number>('DB_PORT');
    this.dbUsername = this.configService.get<string>('DB_USERNAME');
    this.dbPassword = this.configService.get<string>('DB_PASSWORD');
    this.dbName = this.configService.get<string>('DB_NAME');
    this.dbSSL = this.configService.get<boolean>('DB_SSL', false);
    this.dbSSLRejectUnauthorized = this.configService.get<boolean>(
      'DB_SSL_REJECT_UNAUTHORIZED',
      false,
    );
    this.externalServiceUrl = this.configService.get<string>(
      'EXTERNAL_SERVICE_URL',
    );
    this.typeormSync = this.configService.get<boolean>('TYPEORM_SYNC', false);
    this.typeormMigrationsRun = this.configService.get<boolean>(
      'TYPEORM_MIGRATIONS_RUN',
      true,
    );
    this.typeormMigrations =
      this.configService.get<string>('TYPEORM_MIGRATIONS');
    this.typeormEntities = this.configService.get<string>('TYPEORM_ENTITIES');
  }

  getDatabaseConfig() {
    return {
      host: this.dbHost,
      port: this.dbPort,
      username: this.dbUsername,
      password: this.dbPassword,
      database: this.dbName,
      ssl: this.dbSSL,
      sslRejectUnauthorized: this.dbSSLRejectUnauthorized,
    };
  }

  getExternalServiceUrl() {
    return this.externalServiceUrl;
  }

  getTypeormConfig() {
    return {
      sync: this.typeormSync,
      migrationsRun: this.typeormMigrationsRun,
      migrations: this.typeormMigrations,
      entities: this.typeormEntities,
    };
  }
}
