import { TypeOrmModule } from '@nestjs/typeorm';

import { MajorEntity } from '../../entities/major.entity';

import { LogModule } from '../log/log.module';

import { MajorService } from './services/major.service';

export const modules = [TypeOrmModule.forFeature([MajorEntity]), LogModule];

export const controllers = [];

export const providers = [MajorService];

export const exporteds = [MajorService];
