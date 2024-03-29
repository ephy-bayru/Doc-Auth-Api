import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/services/logger.service';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Instantiate services
  const configService = app.get(ConfigService);
  const logger = new LoggerService();
  app.useLogger(logger);

  // Configure global API prefix
  app.setGlobalPrefix('api');

  // Configure API versioning
  const defaultApiVersion = configService.get<string>(
    'API_DEFAULT_VERSION',
    '1',
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: defaultApiVersion,
  });

  // Setup Swagger for API documentation
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);

  // Start the application
  const port = configService.get('PORT', 3000);
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
