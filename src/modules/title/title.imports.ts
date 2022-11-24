import { TypeOrmModule } from '@nestjs/typeorm';

import { TitleEntity } from '../../entities/title.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { TitleService } from './services/title.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([TitleEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [TitleService];

export const exporteds = [TitleService];
