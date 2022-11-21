import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { OptionEntity } from '../../entities/option.entity';

import { OptionService } from './services/option.service';
import { OptionController } from './controllers/option.controller';
export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([OptionEntity]),
  LogModule,
];

export const controllers = [OptionController];

export const providers = [OptionService];

export const exporteds = [OptionService];
