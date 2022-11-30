import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionEntity } from '../../entities/option.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { OptionService } from './services/option.service';
export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([OptionEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [OptionService];

export const exporteds = [OptionService];
