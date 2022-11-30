import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { mysqlFactory } from './factories/mysql.factory';
import { mongoFactory } from './factories/mongo.factory';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';

import { UserModule } from './modules/users/user.module';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

export const modules = [
  SharedModule,
  ScheduleModule.forRoot(),
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
  UserModule,
];
