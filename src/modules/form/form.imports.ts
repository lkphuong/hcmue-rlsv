import { TypeOrmModule } from '@nestjs/typeorm';

import { FormEntity } from '../../entities/form.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { FormService } from './services/form.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([FormEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [FormService];

export const exporteds = [FormService];
