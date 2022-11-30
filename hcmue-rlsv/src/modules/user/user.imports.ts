import { MongooseModule } from '@nestjs/mongoose';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearModule } from '../academic-year/academic_year.module';

import { User, UserSchema } from '../../schemas/user.schema';

import { UserService } from './services/user.service';

export const modules = [
  SharedModule,
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  LogModule,
  AcademicYearModule,
];

export const controllers = [];

export const providers = [UserService];

export const exporteds = [UserService];
