import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemEntity } from '../../entities/item.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ItemService } from './services/item.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([ItemEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [ItemService];

export const exporteds = [ItemService];
