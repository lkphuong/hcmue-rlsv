import { TypeOrmModule } from '@nestjs/typeorm';

import { KEntity } from '../../entities/k.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { KService } from './services/k.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([KEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [KService];

export const exporteds = [KService];
