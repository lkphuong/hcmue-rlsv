import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicYearEntity } from 'src/entities/academic_year.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearController } from './controllers/academic_year.controller';

import { AcademicYearService } from './services/academic_year.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([AcademicYearEntity]),
  LogModule,
];

export const controllers = [AcademicYearController];

export const providers = [AcademicYearService];

export const exporteds = [AcademicYearService];
