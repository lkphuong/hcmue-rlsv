import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { QueryRunner } from 'typeorm';

import { generateCheckRoleUser, generateRoleUser } from '../transform';

import { RoleEntity } from '../../../entities/role.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { UserEntity } from '../../../entities/user.entity';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateSuccessResponse = async (
  role: RoleEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform RoleEntity class to RoleResponse class
  const payload = await generateRoleUser(role);

  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateCheckRoleUserSuccessResponse = async (
  role_user: RoleUsersEntity,
  user: UserEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform RoleEntity class to RoleResponse class
  const payload = await generateCheckRoleUser(role_user, user);

  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_ROLE_USER_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};
