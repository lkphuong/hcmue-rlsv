import { TypeOrmModule } from '@nestjs/typeorm';

import { SemesterEntity } from '../../entities/semester.entity';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { SemesterController } from './controllers/semester.controller';

import { SemesterService } from './services/semester.service';

export const modules = [
  AcademicYearModule,
  SharedModule,
  TypeOrmModule.forFeature([SemesterEntity]),
  LogModule,
];

export const controllers = [SemesterController];

export const providers = [SemesterService];

export const exporteds = [SemesterService];
