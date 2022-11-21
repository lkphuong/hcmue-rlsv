import { TypeOrmModule } from '@nestjs/typeorm';

import { TitleEntity } from '../../entities/title.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { TitleService } from './services/title.service';
import { TitleController } from './controllers/title.controller';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([TitleEntity]),
  LogModule,
];

export const controllers = [TitleController];

export const providers = [TitleService];

export const exporteds = [TitleService];
