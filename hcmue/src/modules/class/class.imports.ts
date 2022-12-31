import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ClassEntity } from '../../entities/class.entity';

import { ClassService } from './services/class.service';
import { ClassController } from './controllers/class.controller';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([ClassEntity]),
  LogModule,
];

export const controllers = [ClassController];
export const providers = [ClassService];
export const exporteds = [ClassService];
