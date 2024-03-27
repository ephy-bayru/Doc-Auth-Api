import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './common/services/cache.service';
import { LoggingInterceptor } from './common/utils/logging.interceptor';
import { LoggerService } from './common/services/logger.service';
@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, CacheService, LoggingInterceptor],
  exports: [AppService, LoggerService, CacheService, LoggingInterceptor],
})
export class AppModule {}
