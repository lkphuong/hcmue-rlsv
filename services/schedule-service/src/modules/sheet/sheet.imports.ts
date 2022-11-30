import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { backgroundFactory } from '../../factories/background.factory';

import { SheetEntity } from '../../entities/sheet.entity';

import { SheetService } from './services/sheet/sheet.service';
import { CronService } from './services/cron/cron.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { FormModule } from '../form/form.module';

import { BACKGROUND_JOB_MODULE } from '../../constants';

export const modules = [
  SharedModule,
  ClientsModule.register([
    {
      name: BACKGROUND_JOB_MODULE,
      transport: Transport.RMQ,
      options: backgroundFactory,
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
