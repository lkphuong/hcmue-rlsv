import { MongooseModule } from '@nestjs/mongoose';

import { Department, DepartmentSchema } from '../../schemas/department.schema';

import { LogModule } from '../log/log.module';

import { DepartmentController } from './controllers/department.controller';

import { DepartmentService } from './services/department.service';

export const modules = [
  MongooseModule.forFeature([
    { name: Department.name, schema: DepartmentSchema },
  ]),
  LogModule,
];

export const controllers = [DepartmentController];

export const providers = [DepartmentService];

export const exporteds = [DepartmentService];
