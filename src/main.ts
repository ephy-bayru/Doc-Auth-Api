import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/services/logger.service';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import * as compression from 'compression';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';
import { SanitizationPipe } from './common/pipes/sanitization.pipe';
import { CustomConfigService } from './config/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const customConfigService = app.get(CustomConfigService);
  const logger = new LoggerService(configService);

  app.useLogger(logger);
  app.use(helmet());
  app.use(compression());

  // Apply global filters
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Apply global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(logger, customConfigService),
    new RateLimitInterceptor(logger),
  );

  // Apply global pipes
  app.useGlobalPipes(new SanitizationPipe(configService));

  // Set global API settings
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('API_DEFAULT_VERSION', '1'),
  });

  // Swagger setup
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    swaggerCustomOptions,
  );

  // Start listening for incoming requests
  const port = configService.get<number>('PORT', 3000);
  try {
    await app.listen(port);
    logger.log('Application is running on:', `http://localhost:${port}`, {
      service: 'MainApplication',
      action: 'start',
      port,
    });
  } catch (error) {
    logger.error('Failed to start the application', error.stack, 'Bootstrap');
  }
}

bootstrap();
