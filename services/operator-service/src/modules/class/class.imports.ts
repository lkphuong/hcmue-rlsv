import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ClassEntity } from 'src/entities/class.entity';

import { ClassService } from './services/class.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([ClassEntity]),
  LogModule,
];

export const controllers = [];
export const providers = [ClassService];
export const exporteds = [ClassService];
