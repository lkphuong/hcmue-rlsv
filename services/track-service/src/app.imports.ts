import { TypeOrmModule } from '@nestjs/typeorm';

import { mysqlFactory } from './factories/mysql.factory';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';

import { ApprovalModule } from './modules/approval/approval.module';

export const modules = [
  SharedModule,
  TypeOrmModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: mysqlFactory,
  }),
  LogModule,
  ApprovalModule,
];

export const controllers = [];
export const providers = [];
