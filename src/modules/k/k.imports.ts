import { MongooseModule } from '@nestjs/mongoose';

import { _KSchema, _K } from 'src/schemas/_k.schema';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { KService } from './services/k.service';

export const modules = [
  SharedModule,
  MongooseModule.forFeature([{ name: _K.name, schema: _KSchema }]),
  LogModule,
];

export const controllers = [];

export const providers = [KService];

export const exporteds = [KService];
