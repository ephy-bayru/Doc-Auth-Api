import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CacheService } from './services/cache.service';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
  imports: [
    CacheModule.register({}),
    ConfigModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [LoggerService, CacheService],
  exports: [LoggerService, CacheService, PrometheusModule],
})
export class CommonModule {}
