import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormEntity } from '../../entities/form.entity';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { HeaderModule } from '../header/header.module';
import { ItemModule } from '../item/item.module';
import { LogModule } from '../log/log.module';
import { OptionModule } from '../option/option.module';
import { SemesterModule } from '../semester/semester.module';
import { SharedModule } from '../shared/shared.module';
import { TitleModule } from '../title/title.module';
import { UserModule } from '../user/user.module';

import { FormController } from './controllers/form.controller';

import { FormService } from './services/form.service';

export const modules = [
  AcademicYearModule,
  HeaderModule,
  ItemModule,
  LogModule,
  OptionModule,
  SemesterModule,
  SharedModule,
  TitleModule,
  TypeOrmModule.forFeature([FormEntity]),
  forwardRef(() => UserModule),
];

export const controllers = [FormController];

export const providers = [FormService];

export const exporteds = [FormService];
