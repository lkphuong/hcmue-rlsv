import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from '../../entities/status.entity';

import { LogModule } from '../log/log.module';

import { StatusController } from './controllers/status.controller';

import { StatusService } from './services/status.service';

export const modules = [TypeOrmModule.forFeature([StatusEntity]), LogModule];

export const controllers = [StatusController];

export const providers = [StatusService];

export const exporteds = [StatusService];
