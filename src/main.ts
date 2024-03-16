import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as favicon from 'serve-favicon';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');

  // Setup Swagger
  const apiVersion = process.env.API_VERSION || 'v1';
  const options = new DocumentBuilder()
    .setTitle('SocialFi Project API document')
    .setDescription('Document for SocialFi API')
    .setVersion(apiVersion)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // Global Validation Custom
  app.useGlobalPipes(new ValidationPipe());

  // Response Transformer Mapping
  // Log request & response information
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)));

  // HttpException custom
  app.useGlobalFilters(new HttpExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)));

  // app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

  // Start API 
  const configService = app.get(ConfigService);
  const PORT = configService.get('port');
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}
bootstrap();