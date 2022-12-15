import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { composerFactory } from '../../factories/composer.factory';

import { User, UserSchema } from '../../schemas/user.schema';

import { UserService } from './services/user/user.service';
import { CronService } from './services/cron/cron.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { FormModule } from '../form/form.module';

import { BACKGROUND_JOB_MODULE, COMPOSER_MODULE } from '../../constants';
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
      name: COMPOSER_MODULE,
      transport: Transport.RMQ,
      options: composerFactory,
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
