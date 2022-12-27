import { TypeOrmModule } from '@nestjs/typeorm';

import { MajorEntity } from 'src/entities/major.entity';

import { MajorService } from './services/major.service';

import { LogModule } from '../log/log.module';

export const modules = [TypeOrmModule.forFeature([MajorEntity]), LogModule];

export const controllers = [];

export const providers = [MajorService];

export const exporteds = [MajorService];
