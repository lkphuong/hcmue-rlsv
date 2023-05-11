import { TypeOrmModule } from '@nestjs/typeorm';

import { SheetHistoryEntity } from '../../entities/sheet_history.entity';
import { EvaluationHistoryEntity } from '../../entities/evaluation_history.entity';

import { OtherModule } from '../other/other.module';
import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';

import { HistoryController } from './controllers/history.controller';

import { HistoryService } from './services/history.service';
import { AdviserModule } from '../adviser/adviser.module';

export const modules = [
  OtherModule,
  LogModule,
  SharedModule,
  TypeOrmModule.forFeature([SheetHistoryEntity, EvaluationHistoryEntity]),
  UserModule,
  AdviserModule,
];

export const controllers = [HistoryController];

export const providers = [HistoryService];

export const exporteds = [HistoryService];
