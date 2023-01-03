import { TypeOrmModule } from '@nestjs/typeorm';

import { FileEntity } from '../../entities/file.entity';

import { CronService } from './services/cron/cron.service';
import { FileService } from './services/file/file.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([FileEntity]),
  LogModule,
];

export const controllers = [];
export const providers = [CronService, FileService];
export const exporteds = [CronService, FileService];
