import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/services/logger.service';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new LoggerService(configService);
  app.useLogger(logger);

  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('API_DEFAULT_VERSION', '1'),
  });

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    swaggerCustomOptions,
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log('Application is running on:', `http://localhost:${port}`, {
    service: 'MainApplication',
    action: 'start',
    port,
  });
}

bootstrap();
