import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { jwtFactory } from './factories/jwt.factory';
import { mysqlFactory } from './factories/mysql.factory';
import { staticFactory } from './factories/static.factory';

import { LogModule } from './modules/log/log.module';
import { SharedModule } from './modules/shared/shared.module';

import { AcademicYearModule } from './modules/academic-year/academic_year.module';
import { AdviserModule } from './modules/adviser/adviser.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassModule } from './modules/class/class.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { FileModule } from './modules/file/file.module';
import { FormModule } from './modules/form/form.module';
import { HeaderModule } from './modules/header/header.module';
import { LevelModule } from './modules/level/level.module';
import { OtherModule } from './modules/other/other.module';
import { ReportModule } from './modules/report/report.module';
import { RoleModule } from './modules/role/role.module';
import { SemesterModule } from './modules/semester/semester.module';
import { SheetModule } from './modules/sheet/sheet.module';
import { TitleModule } from './modules/title/title.module';
import { UserModule } from './modules/user/user.module';

import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

export const modules = [
  SharedModule,
  EventEmitterModule.forRoot(),
  JwtModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: jwtFactory,
  }),
  ServeStaticModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: staticFactory,
  }),
  TypeOrmModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: mysqlFactory,
  }),
  AcademicYearModule,
  AdviserModule,
  AuthModule,
  ClassModule,
  EvaluationModule,
  FileModule,
  FormModule,
  HeaderModule,
  LevelModule,
  LogModule,
  OtherModule,
  ReportModule,
  RoleModule,
  SemesterModule,
  SheetModule,
  TitleModule,
  UserModule,
];
