import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseLoggerService } from '../services/database-logger.service';
import { DatabaseService } from '../services/database.service';
import { typeormConfig } from 'src/config/typeorm.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, DatabaseLoggerService],
      useFactory: async (
        configService: ConfigService,
        databaseLoggerService: DatabaseLoggerService,
      ) => ({
        ...typeormConfig(configService, databaseLoggerService),
      }),
    }),
  ],
  providers: [DatabaseService, DatabaseLoggerService],
  exports: [DatabaseService, DatabaseLoggerService],
})
export class DatabaseModule {}
