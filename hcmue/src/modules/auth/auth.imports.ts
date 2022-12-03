import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AuthController } from './controllers/auth.controller';

import { APP_GUARD } from '@nestjs/core';

import { RoleEntity } from '../../entities/role.entity';
import { RoleUsersEntity } from '../../entities/role_users.entity';
import { SessionEntity } from '../../entities/session.entity';

import { AuthService } from './services/auth.service';
import { ConfigurationService } from '../shared/services/configuration/configuration.service';

import { jwtFactory } from '../../factories/jwt.factory';

import { RolesGuard } from './guards/role.guard';
import { JwtStrategy } from './strategy/jwt';

import { User, UserSchema } from '../../schemas/user.schema';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([RoleEntity, RoleUsersEntity, SessionEntity]),
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  JwtModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: jwtFactory,
  }),
  PassportModule,
  LogModule,
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
