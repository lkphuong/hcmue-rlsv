import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { DepartmentEntity } from '../../entities/department.entity';

import { DepartmentController } from './controllers/department.controller';

import { DepartmentService } from './services/department.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([DepartmentEntity]),
  LogModule,
];

export const controllers = [DepartmentController];

export const providers = [DepartmentService];

export const exporteds = [DepartmentService];
