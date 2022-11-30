import { TypeOrmModule } from '@nestjs/typeorm';

import { LevelEntity } from '../../entities/level.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { LevelService } from './services/level.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([LevelEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [LevelService];

export const exporteds = [LevelService];
