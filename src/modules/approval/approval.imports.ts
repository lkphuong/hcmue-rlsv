import { TypeOrmModule } from '@nestjs/typeorm';

import { ApprovalEntity } from 'src/entities/approval.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ApprovalService } from './services/approval.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([ApprovalEntity]),
  LogModule,
];

export const controllers = [];

export const providers = [ApprovalService];

export const exporteds = [ApprovalService];
