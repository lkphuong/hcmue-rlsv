import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { mysqlFactory } from './factories/mysql.factory';
import { mongoFactory } from './factories/mongo.factory';

import { DepartmentModule } from './modules/department/department.module';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: mysqlFactory,
  }),
  MongooseModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: mongoFactory,
  }),
  LogModule,

  DepartmentModule,
];
