import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ItemEntity } from '../../entities/item.entity';

import { ItemService } from './services/item.service';

import { ItemController } from './controllers/item.controller';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([ItemEntity]),
  LogModule,
];

export const controllers = [ItemController];

export const providers = [ItemService];

export const exporteds = [ItemService];
