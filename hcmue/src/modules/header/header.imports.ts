import { TypeOrmModule } from '@nestjs/typeorm';

import { HeaderEntity } from '../../entities/header.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { HeaderService } from './services/header.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([HeaderEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [HeaderService];

export const exporteds = [HeaderService];
