import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OtherEntity } from '../../entities/other.entity';

import { DepartmentModule } from '../department/department.module';
import { LogModule } from '../log/log.module';
import { RoleModule } from '../role/role.module';

import { OtherController } from './controllers/other.controller';

import { OtherService } from './services/other.service';
import { AcademicYearModule } from '../academic-year/academic_year.module';

export const modules = [
  LogModule,
  DepartmentModule,
  AcademicYearModule,
  TypeOrmModule.forFeature([OtherEntity]),
  forwardRef(() => RoleModule),
];

export const controllers = [OtherController];

export const providers = [OtherService];

export const exporteds = [OtherService];
