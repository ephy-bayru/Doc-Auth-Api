import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { LoggerService } from 'src/common/services/logger.service';
import { sequelizeConfig } from 'src/config/sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, LoggerService],
      useFactory: async (
        configService: ConfigService,
        loggerService: LoggerService,
      ) => sequelizeConfig(configService, loggerService),
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
