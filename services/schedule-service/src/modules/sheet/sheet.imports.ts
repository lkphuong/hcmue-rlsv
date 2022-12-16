import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SheetEntity } from '../../entities/sheet.entity';

import { ApprovalService } from './services/approval/approval.service';
import { CronService } from './services/cron/cron.service';
import { SheetService } from './services/sheet/sheet.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { FormModule } from '../form/form.module';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([SheetEntity]),
  FormModule,
  HttpModule,
  LogModule,
];

export const controllers = [];
export const providers = [ApprovalService, CronService, SheetService];
export const exporteds = [ApprovalService, CronService, SheetService];
