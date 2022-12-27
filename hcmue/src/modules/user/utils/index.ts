import { Request } from 'express';

import {
  convertObjectId2String,
  returnObjectsWithPaging,
} from '../../../utils';
import { generateUsersArray } from '../transforms';

import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { UserResponse } from '../interfaces/users-response.interface';

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

  // Transform UserSchema class to UserResponse class
  const payload = await generateUsersArray(users, role_users);

  // Returns objects
  return returnObjectsWithPaging<UserResponse>(pages, page, payload);
};

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
