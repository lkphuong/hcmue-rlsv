import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { CacheClassEntity } from '../../entities/cache_class.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ClassModule } from '../class/class.module';
import { DepartmentModule } from '../department/department.module';
import { LevelModule } from '../level/level.module';
import { ReportController } from './controllers/report.controller';
import { SemesterModule } from '../semester/semester.module';
import { SheetModule } from '../sheet/sheet.module';
import { UserModule } from '../user/user.module';

import { CacheClassService } from './services/cache-class.service';

export const modules = [
  HttpModule,
  SharedModule,
  TypeOrmModule.forFeature([CacheClassEntity]),
  LogModule,
  AcademicYearModule,
  ClassModule,
  DepartmentModule,
  LevelModule,
  SemesterModule,
  SheetModule,
  UserModule,
];

export const controllers = [ReportController];
export const providers = [CacheClassService];
export const exporteds = [CacheClassService];
