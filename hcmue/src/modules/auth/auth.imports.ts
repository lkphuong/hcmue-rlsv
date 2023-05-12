import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdviserModule } from '../adviser/adviser.module';
import { ClassModule } from '../class/class.module';
import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { OtherModule } from '../other/other.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { MajorModule } from '../major/major.module';

import { AuthController } from './controllers/auth.controller';

import { APP_GUARD } from '@nestjs/core';

import { RoleEntity } from '../../entities/role.entity';
import { RoleUsersEntity } from '../../entities/role_users.entity';
import { SessionEntity } from '../../entities/session.entity';
import { UserEntity } from '../../entities/user.entity';

import { AuthService } from './services/auth.service';
import { ConfigurationService } from '../shared/services/configuration/configuration.service';

import { jwtFactory } from '../../factories/jwt.factory';

import { RolesGuard } from './guards/role.guard';
import { JwtStrategy } from './strategy/jwt';

export const modules = [
  AdviserModule,
  ClassModule,
  SharedModule,
  MajorModule,
  TypeOrmModule.forFeature([
    RoleEntity,
    RoleUsersEntity,
    SessionEntity,
    UserEntity,
  ]),
  JwtModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: jwtFactory,
  }),
  PassportModule,
  LogModule,
  forwardRef(() => RoleModule),
  forwardRef(() => UserModule),
  forwardRef(() => OtherModule),
];

export const controllers = [AuthController];
export const providers = [
  AuthService,
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];
export const exporteds = [AuthService];
