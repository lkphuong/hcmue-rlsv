import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { backgroundFactory } from './factories/background.factory';

import { AppModule } from './app.module';

import {
  BACKGROUND_JOB_SERVICE_HOST,
  BACKGROUND_JOB_SERVICE_PORT,
} from './constants';

async function bootstrap() {
  const host =
    process.env.BACKGROUND_JOB_SERVICE_HOST || BACKGROUND_JOB_SERVICE_HOST;

  const port =
    parseInt(process.env.BACKGROUND_JOB_SERVICE_PORT) ||
    BACKGROUND_JOB_SERVICE_PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: backgroundFactory,
    },
  );

  await app.listen();

  console.log(`Operator Queue microservice is listenning.`);
  console.log(`Host: ${host}`);
  console.log(`Port : ${port}`);
}

bootstrap();
