import { TypeOrmModule } from '@nestjs/typeorm';

import { SheetEntity } from '../../entities/sheet.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ApprovalModule } from '../approval/approval.module';
import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ClassModuel } from '../class/class.module';
import { KModule } from '../k/k.module';
import { DepartmentModule } from '../department/department.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { LevelModule } from '../level/level.module';
import { FormModule } from '../form/form.module';
import { ItemModule } from '../item/item.module';
import { TitleModule } from '../title/title.modules';
import { OptionModule } from '../option/option.module';

import { SheetController } from './controllers/sheet.controller';

import { SheetService } from './services/sheet.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([SheetEntity]),
  LogModule,
  UserModule,
  AcademicYearModule,
  ApprovalModule,
  ClassModuel,
  FormModule,
  KModule,
  DepartmentModule,
  EvaluationModule,
  ItemModule,
  TitleModule,
  OptionModule,
  LevelModule,
];

export const controllers = [SheetController];

export const providers = [SheetService];

export const exporteds = [SheetService];
