import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { DepartmentEntity } from 'src/entities/department.entity';

import { DepartmentService } from './services/department.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([DepartmentEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [DepartmentService];

export const exporteds = [DepartmentService];
