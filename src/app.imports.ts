import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { jwtFactory } from './factories/jwt.factory';
import { mongoFactory } from './factories/mongo.factory';
import { mysqlFactory } from './factories/mysql.factory';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';

import { AcademicYearModule } from './modules/academic-year/academic_year.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassModuel } from './modules/class/class.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { FormModule } from './modules/form/form.module';
import { HeaderModule } from './modules/header/header.modules';
import { LevelModule } from './modules/level/level.module';
import { SemesterModule } from './modules/semester/semester.module';
import { SheetModule } from './modules/sheet/sheet.module';
import { TitleModule } from './modules/title/title.module';
import { UserModule } from './modules/user/user.module';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

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
  FormModule,
  HeaderModule,
  TitleModule,
];
