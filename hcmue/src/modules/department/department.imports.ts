import { MongooseModule } from '@nestjs/mongoose';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { Department, DepartmentSchema } from '../../schemas/department.schema';
import { DepartmentService } from './services/department.service';

export const modules = [
  SharedModule,
  MongooseModule.forFeature([
    { name: Department.name, schema: DepartmentSchema },
  ]),
  LogModule,
];

export const controllers = [];

export const providers = [DepartmentService];

export const exporteds = [DepartmentService];
