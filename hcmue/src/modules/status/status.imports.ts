import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from '../../entities/status.entity';

import { LogModule } from '../log/log.module';

import { StatusService } from './status/status.service';

export const modules = [TypeOrmModule.forFeature([StatusEntity]), LogModule];

export const controllers = [];

export const providers = [StatusService];

export const exporteds = [StatusService];
