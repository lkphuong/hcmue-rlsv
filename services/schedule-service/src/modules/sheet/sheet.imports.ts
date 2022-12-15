import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { trackingFactory } from '../../factories/tracking.factory';

import { SheetEntity } from '../../entities/sheet.entity';

import { SheetService } from './services/sheet/sheet.service';
import { CronService } from './services/cron/cron.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { FormModule } from '../form/form.module';

import { TRACKING_MODULE } from '../../constants';

export const modules = [
  SharedModule,
  ClientsModule.register([
    {
      name: TRACKING_MODULE,
      transport: Transport.RMQ,
      options: trackingFactory,
    },
  ]),
  TypeOrmModule.forFeature([SheetEntity]),
  FormModule,
  HttpModule,
  LogModule,
];

export const controllers = [];
export const providers = [CronService, SheetService];
export const exporteds = [CronService, SheetService];
