import { TypeOrmModule } from '@nestjs/typeorm';

import { OtherEntity } from '../../entities/other.entity';

import { DepartmentModule } from '../department/department.module';
import { LogModule } from '../log/log.module';

import { OtherController } from './controllers/other.controller';

import { OtherService } from './services/other.service';

export const modules = [
  LogModule,
  DepartmentModule,
  TypeOrmModule.forFeature([OtherEntity]),
];

export const controllers = [OtherController];

export const providers = [OtherService];

export const exporteds = [OtherService];
