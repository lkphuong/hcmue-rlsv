import { RoleEntity } from '../../../entities/role.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { User } from '../../../schemas/user.schema';

import {
  CheckRoleUserResponse,
  RoleUserResponse,
} from '../interfaces/assign-user-role-response.interface';

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

export const generateCheckRoleUser = (
  role_user: RoleUsersEntity,
  user: User,
) => {
  const payload: CheckRoleUserResponse = {
    user: {
      id: role_user.user_id,
      name: user.fullname,
    },
    role: {
      id: role_user.role.code,
      name: role_user.role.name,
    },
  };
  return payload;
};
