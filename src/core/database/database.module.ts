import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { LoggerService } from 'src/common/services/logger.service';
import { typeormConfig } from 'src/config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, LoggerService],
      useFactory: async (
        configService: ConfigService,
        loggerService: LoggerService,
      ) => typeormConfig(configService, loggerService),
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
