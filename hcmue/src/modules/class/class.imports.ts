import { MongooseModule } from '@nestjs/mongoose';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { Class, ClassSchema } from '../../schemas/class.schema';

import { ClassService } from './services/class.service';
import { ClassController } from './controllers/class.controller';

export const modules = [
  SharedModule,
  MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  LogModule,
];

export const controllers = [ClassController];
export const providers = [ClassService];
export const exporteds = [ClassService];
