import { TypeOrmModule } from '@nestjs/typeorm';

import { SheetEntity } from '../../entities/sheet.entity';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ClassModule } from '../class/class.module';
import { DepartmentModule } from '../department/department.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { FileModule } from '../file/file.module';
import { FormModule } from '../form/form.module';
import { HeaderModule } from '../header/header.module';
import { ItemModule } from '../item/item.module';
import { OtherModule } from '../other/other.module';
import { LevelModule } from '../level/level.module';
import { LogModule } from '../log/log.module';
import { OptionModule } from '../option/option.module';
import { SemesterModule } from '../semester/semester.module';
import { SharedModule } from '../shared/shared.module';
import { TitleModule } from '../title/title.module';
import { UserModule } from '../user/user.module';

import { SheetController } from './controllers/sheet.controller';

import { SheetService } from './services/sheet.service';

export const modules = [
  AcademicYearModule,
  ClassModule,
  DepartmentModule,
  EvaluationModule,
  FileModule,
  FormModule,
  HeaderModule,
  ItemModule,
  OtherModule,
  LevelModule,
  LogModule,
  OptionModule,
  SemesterModule,
  SharedModule,
  TitleModule,
  TypeOrmModule.forFeature([SheetEntity]),
  UserModule,
];

export const controllers = [SheetController];

export const providers = [SheetService];

export const exporteds = [SheetService];
