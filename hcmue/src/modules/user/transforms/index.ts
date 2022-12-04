import { mapRoleForUser } from '../utils';

import { User } from '../../../schemas/user.schema';
import { RoleUsersEntity } from '../../../entities/role_users.entity';

import { UserResponse } from '../interfaces/get-users-response.interface';

export const generateUsersArray = async (
  users: User[] | null,
  role_users: RoleUsersEntity[],
) => {
  if (users && users.length > 0) {
    const payload: UserResponse[] = [];

    for await (const user of users) {
      const item: UserResponse = {
        user_id: user._id.toString(),
        name: user.fullname,

        department: user.department
          ? {
              id: user.departmentId.toString(),
              name: user.department.name,
            }
          : null,

        classes: user.class
          ? {
              id: user.classId.toString(),
              name: user.class.name,
            }
          : null,

        role: mapRoleForUser(user._id.toString(), role_users),
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
