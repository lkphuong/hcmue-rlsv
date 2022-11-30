import { TypeOrmModule } from '@nestjs/typeorm';

import { mysqlFactory } from './factories/mysql.factory';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';
import { SheetModule } from './modules/sheet/sheet.module';

export const modules = [
  SharedModule,
  TypeOrmModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: mysqlFactory,
  }),
  LogModule,
  SheetModule,
];

export const controllers = [];
export const providers = [];
