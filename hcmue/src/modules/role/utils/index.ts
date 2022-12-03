import { Request } from 'express';
import {
  convertObjectId2String,
  returnObjectsWithPaging,
} from '../../../utils';

import { RoleUsersEntity } from '../../../entities/role_users.entity';

import { generateUsersArray } from '../transform';

import { UserResponse } from '../interfaces/user_response.interface';
import { HandlerException } from 'src/exceptions/HandlerException';
import { SERVER_EXIT_CODE } from 'src/constants/enums/error-code.enum';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessage } from '../constants/enums/errors.enum';

export const mapRoleForUser = (
  user_id: string,
  roles: RoleUsersEntity[] | null,
) => {
  if (roles) {
    const result = roles.find(
      (e) => e.user_id == convertObjectId2String(user_id),
    );

    if (result && result.role) {
      return result.role.code;
    }
    return 0;
  }
  return 0;
};

export const generateUserIds = (users: any) => {
  return users.map((item) => {
    return convertObjectId2String(item._id);
  });
};

export const generateResponses = async (
  pages: number,
  page: number,
  users: any,
  role_users: RoleUsersEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', users);

  // Transform users schema class to UserResponse class
  const payload = await generateUsersArray(users, role_users);

  // Returns objects
  return returnObjectsWithPaging<UserResponse>(pages, page, payload);
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
