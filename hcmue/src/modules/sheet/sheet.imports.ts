import { TypeOrmModule } from '@nestjs/typeorm';

import { SheetEntity } from '../../entities/sheet.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ClassModule } from '../class/class.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { HeaderModule } from '../header/header.modules';
import { KModule } from '../k/k.module';
import { DepartmentModule } from '../department/department.module';
import { LevelModule } from '../level/level.module';
import { FormModule } from '../form/form.module';
import { ItemModule } from '../item/item.module';
import { TitleModule } from '../title/title.module';
import { OptionModule } from '../option/option.module';

import { SheetController } from './controllers/sheet.controller';

import { SheetService } from './services/sheet.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([SheetEntity]),
  LogModule,
  AcademicYearModule,
  ClassModule,
  DepartmentModule,
  EvaluationModule,
  FormModule,
  HeaderModule,
  KModule,
  ItemModule,
  TitleModule,
  OptionModule,
  LevelModule,
  UserModule,
];

export const controllers = [SheetController];

export const providers = [SheetService];

export const exporteds = [SheetService];
