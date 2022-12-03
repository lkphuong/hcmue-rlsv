import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { RoleEntity } from '../../../entities/role.entity';

import { mapRoleForUser } from '../utils';

import {
  RoleUserResponse,
  UserResponse,
} from '../interfaces/user_response.interface';

export const generateUsersArray = async (
  users: any,
  role_users: RoleUsersEntity[],
) => {
  if (users && users.length > 0) {
    const payload: UserResponse[] = [];

    for await (const user of users) {
      const item: UserResponse = {
        user_id: user._id,
        name: user.fullname,
        department: user.department
          ? {
              id: user.departmentId,
              name: user.department.name,
            }
          : null,
        classes: user.classs
          ? {
              id: user.classId,
              name: user.classs.name,
            }
          : null,
        role: mapRoleForUser(user._id, role_users),
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateRoleUser = (role: RoleEntity) => {
  if (role) {
    const payload: RoleUserResponse = {
      id: role.code,
      name: role.name,
    };

    return payload;
  }
  return null;
};
