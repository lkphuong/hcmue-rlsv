import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { trackingFactory } from './factories/tracking.factory';

import { AppModule } from './app.module';

import { TRACKING_SERVICE_HOST, TRACKING_SERVICE_PORT } from './constants';

async function bootstrap() {
  const host = process.env.TRACKING_SERVICE_HOST || TRACKING_SERVICE_HOST;

  const port =
    parseInt(process.env.TRACKING_SERVICE_PORT) || TRACKING_SERVICE_PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: trackingFactory,
    },
  );

  await app.listen();

  console.log(`Tracking Queue microservice is listenning.`);
  console.log(`Host: ${host}`);
  console.log(`Port : ${port}`);
}

bootstrap();
