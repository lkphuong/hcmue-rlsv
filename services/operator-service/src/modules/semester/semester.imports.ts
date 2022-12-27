import { TypeOrmModule } from '@nestjs/typeorm';

import { SemesterEntity } from 'src/entities/semester.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { SemesterController } from './controllers/semester.controller';

import { SemesterService } from './services/semester.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([SemesterEntity]),
  LogModule,
];

export const controllers = [SemesterController];

export const providers = [SemesterService];

export const exporteds = [SemesterService];
