import { UserEntity } from '../../../entities/user.entity';

import { UserResponse } from '../interfaces/users-response.interface';

export const generateUsersArray = async (users: UserEntity[] | null) => {
  if (users && users.length > 0) {
    const payload: UserResponse[] = [];

    for await (const user of users) {
      const item: UserResponse = {
        user_id: user.id,
        std_code: user.std_code,
        name: user.fullname,

        department: user.department
          ? {
              id: user.department_id,
              name: user.department.name,
            }
          : null,

        classes: user.class
          ? {
              id: user.class_id,
              name: user.class.name,
            }
          : null,

        role: user.role_user
          ? user.role_user.role
            ? user.role_user.role.id
            : null
          : null,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
