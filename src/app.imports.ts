import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { mysqlFactory } from './factories/mysql.factory';
import { mongoFactory } from './factories/mongo.factory';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';

import { AuthModule } from './modules/auth/auth.module';
import { ClassModuel } from './modules/class/class.module';
import { SemesterModule } from './modules/semester/semester.module';
import { AcademicYearModule } from './modules/academic-year/academic_year.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { LevelModule } from './modules/level/level.module';
import { SheetModule } from './modules/sheet/sheet.module';
import { UserModule } from './modules/user/user.module';
import { FormmModule } from './modules/formm/form.module';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

import { jwtFactory } from './factories/jwt.factory';
import { HeaderModule } from './modules/header/header.modules';
import { TitleModule } from './modules/title/title.modules';

export const modules = [
  SharedModule,
  JwtModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: jwtFactory,
  }),
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
  AcademicYearModule,
  AuthModule,
  ClassModuel,
  LevelModule,
  SemesterModule,
  SheetModule,
  UserModule,
  EvaluationModule,
  HeaderModule,
  TitleModule,
  FormmModule,
];
