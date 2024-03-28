import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common/services/logger.service';

export const sequelizeConfig = (
  configService: ConfigService,
  loggerService?: LoggerService,
): SequelizeModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const useSSL = configService.get<boolean>('DB_SSL', isProduction);

  const sslOptions = useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: configService.get<boolean>(
            'DB_SSL_REJECT_UNAUTHORIZED',
            true,
          ),
        },
      }
    : {};

  return {
    dialect: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    autoLoadModels: true,
    synchronize: !isProduction,
    logging: loggerService ? (msg) => loggerService.log(msg) : false,
    dialectOptions: useSSL ? sslOptions : {},
    timezone: configService.get<string>('DB_TIMEZONE', '+00:00'),
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  };
};
