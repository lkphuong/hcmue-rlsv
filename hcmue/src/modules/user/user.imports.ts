import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ClassModule } from '../class/class.module';
import { DepartmentModule } from '../department/department.module';
import { FileModule } from '../file/file.module';
import { FormModule } from '../form/form.module';
import { KModule } from '../k/k.module';
import { MajorModule } from '../major/major.module';
import { RoleModule } from '../role/role.module';
import { SemesterModule } from '../semester/semester.module';
import { StatusModule } from '../status/status.module';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { GenerateUserUpdateListener } from './listeners/generate_update_password.listener';

export const modules = [
  TypeOrmModule.forFeature([UserEntity]),
  AcademicYearModule,
  ClassModule,
  forwardRef(() => DepartmentModule),
  forwardRef(() => FileModule),
  forwardRef(() => FormModule),
  KModule,
  LogModule,
  MajorModule,
  forwardRef(() => RoleModule),
  SemesterModule,
  SharedModule,
  StatusModule,
];

export const controllers = [UserController];
export const providers = [UserService, GenerateUserUpdateListener];
export const exporteds = [UserService, GenerateUserUpdateListener];
