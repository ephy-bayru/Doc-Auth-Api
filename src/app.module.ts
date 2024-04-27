import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingInterceptor } from './common/utils/logging.interceptor';
import { DatabaseModule } from './core/database/database.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import configuration from './config/configuration';
import { CustomConfigService } from './config/services/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV}`,
      expandVariables: true,
    }),
    HealthModule,
    CommonModule,
    DatabaseModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    CustomConfigService,
  ],
  exports: [CustomConfigService],
})
export class AppModule {}
