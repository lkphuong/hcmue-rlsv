import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { AuthController } from './controllers/auth.controller';

import { AuthService } from './services/auth.service';
import { ConfigurationService } from '../shared/services/configuration/configuration.service';

import { jwtFactory } from '../../factories/jwt.factory';

import { JwtStrategy } from './strategy/jwt';

import { User, UserSchema } from '../../schemas/user.schema';

import { SessionEntity } from '../../entities/session.entity';
import { RoleUserEntity } from '../../entities/role_users.entity';
import { RoleEntity } from '../../entities/role.entity';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([RoleEntity, RoleUserEntity, SessionEntity]),
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
export const providers = [AuthService, JwtStrategy];
export const exporteds = [AuthService];
