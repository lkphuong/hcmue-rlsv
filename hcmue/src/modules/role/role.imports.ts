import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';

import { RoleEntity } from '../../entities/role.entity';
import { RoleUsersEntity } from '../../entities/role_users.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ClassModule } from '../class/class.module';
import { DepartmentModule } from '../department/department.module';
import { UserModule } from '../user/user.module';

import { RoleController } from './controllers/role.controller';

import { RoleService } from './services/role/role.service';
import { RoleUsersService } from './services/role_users/role_users.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([RoleEntity, RoleUsersEntity]),
  LogModule,
  ClassModule,
  forwardRef(() => DepartmentModule),
  forwardRef(() => UserModule),
];

export const controllers = [RoleController];
export const providers = [RoleService, RoleUsersService];
export const exporteds = [RoleService, RoleUsersService];
