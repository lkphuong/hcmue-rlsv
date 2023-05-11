import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { json, urlencoded } from 'express';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './filters/http-exception.filter';

import { LogService } from './modules/log/services/log.service';
import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET, POST, PUT, DELETE'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter(new ConfigurationService()));
  app.useLogger(new LogService());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      // exceptionFactory: (errors: ValidationError[]) =>
      //   console.log('Validation errors: ', errors),
    }),
  );
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT_RUNTIME || 3001);
  console.log(
    `Hcmue service is listenning on ${process.env.PORT_RUNTIME || 3000}.`,
  );
}

bootstrap();
