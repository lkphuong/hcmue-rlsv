import { TypeOrmModule } from '@nestjs/typeorm';

import { ApprovalEntity } from '../../entities/approval.entity';

import { ApprovalService } from './services/approval.service';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

export const modules = [
  SharedModule,

  TypeOrmModule.forFeature([ApprovalEntity]),
  LogModule,
];

export const controllers = [];
export const providers = [ApprovalService];
export const exporteds = [ApprovalService];
