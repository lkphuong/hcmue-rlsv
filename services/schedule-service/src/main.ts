import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import { SCHEDULE_SERVICE_HOST, SCHEDULE_SERVICE_PORT } from './constants';

async function bootstrap() {
  const host = process.env.SCHEDULE_SERVICE_HOST || SCHEDULE_SERVICE_HOST;

  const port =
    parseInt(process.env.SCHEDULE_SERVICE_PORT) || SCHEDULE_SERVICE_PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
        retryAttempts: 0,
        retryDelay: 3000,
      },
    },
  );

  await app.listen();

  console.log(`Schedule microservice is listenning.`);
  console.log(`Host: ${host}`);
  console.log(`Port : ${port}`);
}

bootstrap();
