import { TypeOrmModule } from '@nestjs/typeorm';

import { FormEntity } from '../../entities/form.entity';
import { AcademicYearModule } from '../academic-year/academic_year.module';
import { HeaderModule } from '../header/header.module';
import { ItemModule } from '../item/item.module';
import { LogModule } from '../log/log.module';
import { SemesterModule } from '../semester/semester.module';
import { SharedModule } from '../shared/shared.module';
import { TitleModule } from '../title/title.module';
import { OptionModule } from '../option/option.module';
import { FormController } from './controllers/form.controller';

import { FormService } from './services/form.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([FormEntity]),
  LogModule,
  HeaderModule,
  TitleModule,
  ItemModule,
  AcademicYearModule,
  SemesterModule,
  OptionModule,
];

export const controllers = [FormController];

export const providers = [FormService];

export const exporteds = [FormService];
