import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { DepartmentEntity } from '../../entities/department.entity';

import { DepartmentController } from './controllers/department.controller';

import { DepartmentService } from './services/department.service';
import { FormModule } from '../form/form.module';
import { AcademicYearModule } from '../academic-year/academic_year.module';

export const modules = [
  forwardRef(() => FormModule),
  SharedModule,
  TypeOrmModule.forFeature([DepartmentEntity]),
  AcademicYearModule,
  LogModule,
];

export const controllers = [DepartmentController];

export const providers = [DepartmentService];

export const exporteds = [DepartmentService];
