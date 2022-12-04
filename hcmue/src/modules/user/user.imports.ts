import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../schemas/user.schema';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AcademicYearModule } from '../academic-year/academic_year.module';
import { RoleModule } from '../role/role.module';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

export const modules = [
  SharedModule,
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  AcademicYearModule,
  LogModule,
  RoleModule,
];

export const controllers = [UserController];
export const providers = [UserService];
export const exporteds = [UserService];
