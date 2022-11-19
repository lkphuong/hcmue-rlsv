import { TypeOrmModule } from '@nestjs/typeorm';

import { EvaluationEntity } from '../../entities/evaluation.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { EvaluationService } from './services/evaluation.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([EvaluationEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [EvaluationService];

export const exporteds = [EvaluationService];
