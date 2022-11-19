import { MongooseModule } from '@nestjs/mongoose';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearModule } from '../academic-year/academic_year.module';

import { Class, ClassSchema } from '../../schemas/class.schema';

import { ClassService } from './services/class.service';

export const modules = [
  SharedModule,
  MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  LogModule,
  AcademicYearModule,
];

export const controllers = [];

export const providers = [ClassService];

export const exporteds = [ClassService];
