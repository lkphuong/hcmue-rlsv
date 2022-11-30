import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { composerFactory } from './factories/composer.factory';

import { AppModule } from './app.module';

import { COMPOSER_SERVICE_HOST, COMPOSER_SERVICE_PORT } from './constants';

async function bootstrap() {
  const host = process.env.COMPOSER_SERVICE_HOST || COMPOSER_SERVICE_HOST;

  const port =
    parseInt(process.env.COMPOSER_SERVICE_PORT) || COMPOSER_SERVICE_PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: composerFactory,
    },
  );

  await app.listen();

  console.log(`Composer Queue microservice is listenning.`);
  console.log(`Host: ${host}`);
  console.log(`Port : ${port}`);
}

bootstrap();
