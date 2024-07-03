import { TypeOrmModule } from '@nestjs/typeorm';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { DepartmentEntity } from '../../entities/department.entity';

import { DepartmentController } from './controllers/department.controller';

import { DepartmentService } from './services/department.service';
import { AcademicYearModule } from '../academic-year/academic_year.module';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([DepartmentEntity]),
  LogModule,
  AcademicYearModule,
];

export const controllers = [DepartmentController];

export const providers = [DepartmentService];

export const exporteds = [DepartmentService];
