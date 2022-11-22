import { TypeOrmModule } from '@nestjs/typeorm';

import { FormEntity } from '../../entities/form.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { AcademicYearModule } from '../academic-year/academic_year.module';
import { ItemModule } from '../item/item.module';
import { TitleModule } from '../title/title.modules';
import { OptionModule } from '../option/option.module';
import { SemesterModule } from '../semester/semester.module';
import { HeaderModule } from '../header/header.modules';

import { FormController } from './controllers/form.controller';

import { FormmService } from './service/service.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([FormEntity]),
  LogModule,
  AcademicYearModule,
  ItemModule,
  TitleModule,
  OptionModule,
  SemesterModule,
  HeaderModule,
];

export const controllers = [FormController];

export const providers = [FormmService];

export const exporteds = [FormmService];
