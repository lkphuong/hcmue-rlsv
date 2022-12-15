import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { trackingFactory } from '../../factories/tracking.factory';

import { User, UserSchema } from '../../schemas/user.schema';

import { UserService } from './services/user/user.service';
import { CronService } from './services/cron/cron.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { FormModule } from '../form/form.module';

import { BACKGROUND_JOB_MODULE, TRACKING_MODULE } from '../../constants';
import { backgroundFactory } from 'src/factories/background.factory';

export const modules = [
  SharedModule,
  ClientsModule.register([
    {
      name: BACKGROUND_JOB_MODULE,
      transport: Transport.RMQ,
      options: backgroundFactory,
    },
    {
      name: TRACKING_MODULE,
      transport: Transport.RMQ,
      options: trackingFactory,
    },
  ]),
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  FormModule,
  HttpModule,
  LogModule,
];

export const controllers = [];
export const providers = [CronService, UserService];
export const exporteds = [CronService, UserService];
