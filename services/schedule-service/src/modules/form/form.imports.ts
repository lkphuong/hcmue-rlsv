import { TypeOrmModule } from '@nestjs/typeorm';
import { FormEntity } from '../../entities/form.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { CronService } from './services/cron/cron.service';
import { FormService } from './services/form/form.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([FormEntity]),
  LogModule,
];

export const providers = [CronService, FormService];

export const exporteds = [CronService, FormService];
