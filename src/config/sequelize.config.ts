import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const sequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  autoLoadModels: true,
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging:
    configService.get<string>('NODE_ENV') === 'development'
      ? console.log
      : false,
  ssl: configService.get<boolean>(
    'DB_SSL',
    configService.get<string>('NODE_ENV') === 'production',
  ), // Enable SSL in production by default
  dialectOptions: configService.get<boolean>(
    'DB_SSL',
    configService.get<string>('NODE_ENV') === 'production',
  )
    ? {
        ssl: {
          require: configService.get<boolean>('DB_SSL', true),
          rejectUnauthorized: configService.get<boolean>(
            'DB_SSL_REJECT_UNAUTHORIZED',
            true,
          ), // Secure by default
        },
      }
    : {},
  timezone: configService.get<string>('DB_TIMEZONE', '+00:00'),
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});
