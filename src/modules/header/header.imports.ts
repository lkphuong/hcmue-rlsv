import { TypeOrmModule } from '@nestjs/typeorm';

import { HeaderEntity } from '../../entities/header.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { HeaderService } from './services/header.service';
import { HeaderController } from './controllers/header.controller';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([HeaderEntity]),
  LogModule,
];

export const controllers = [HeaderController];

export const providers = [HeaderService];

export const exporteds = [HeaderService];
