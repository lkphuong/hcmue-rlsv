import { TypeOrmModule } from '@nestjs/typeorm';

import { LevelEntity } from '../../entities/level.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { LevelController } from './controllers/level.controller';

import { LevelService } from './services/level.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([LevelEntity]),
  LogModule,
];

export const controllers = [LevelController];
export const providers = [LevelService];
export const exporteds = [LevelService];
