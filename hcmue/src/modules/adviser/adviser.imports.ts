import { TypeOrmModule } from '@nestjs/typeorm';

import { AdviserEntity } from '../../entities/adviser.entity';
import { AdviserClassesEntity } from '../../entities/adviser_classes.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ClassModule } from '../class/class.module';
import { DepartmentModule } from '../department/department.module';
import { FileModule } from '../file/file.module';
import { RoleModule } from '../role/role.module';

import { AdviserController } from './controllers/adviser.controller';

import { AdviserService } from './services/adviser/adviser.service';
import { AdviserClassesService } from './services/adviser-classes/adviser_classes.service';
import { GenerateAdviserUpdateListener } from './listeners/generate_update_password.listener';

export const modules = [
  TypeOrmModule.forFeature([AdviserEntity, AdviserClassesEntity]),
  AcademicYearModule,
  ClassModule,
  DepartmentModule,
  RoleModule,
  FileModule,
  LogModule,
  SharedModule,
];

export const controllers = [AdviserController];
export const providers = [
  AdviserService,
  AdviserClassesService,
  GenerateAdviserUpdateListener,
];
export const exporteds = [
  AdviserService,
  AdviserClassesService,
  GenerateAdviserUpdateListener,
];
