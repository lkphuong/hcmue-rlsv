import { ClassEntity } from '../../../entities/class.entity';
import { ClassResponse } from '../../class/interfaces/class_response.interface';
import { UserEntity } from '../../../entities/user.entity';

import {
  BaseResponse,
  UserResponse,
} from '../interfaces/users-response.interface';

export const generateUsersArray = async (users: UserEntity[] | null) => {
  if (users && users.length > 0) {
    const payload: UserResponse[] = [];

    for await (const user of users) {
      const item: UserResponse = {
        id: user.id,
        std_code: user.std_code,
        name: user.fullname,
        birthday: user.birthday,

        academic: user.academic
          ? {
              id: user.academic.id,
              name: user.academic.start + ' - ' + user.academic.end,
            }
          : null,

        department: user.department
          ? {
              id: user.department_id,
              name: user.department.name,
            }
          : null,

        classes: user.class
          ? {
              id: user.class_id,
              code: user.class.code,
              name: user.class.name,
            }
          : null,

        major: user.major ? { id: user.major_id, name: user.major.name } : null,

        status: user.status
          ? { id: user.status_id, name: user.status.name }
          : null,

        k: user.class
          ? user.class.k
            ? { id: user.class.k, name: user.class.K.name }
            : null
          : null,

        role: user.role_user
          ? user.role_user.role
            ? user.role_user.role.code
            : 0
          : 0,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateBaseResponse = (data: any[] | null) => {
  const payload: BaseResponse[] = [];
  if (data && data.length > 0) {
    for (const i of data) {
      const item: BaseResponse = {
        id: i.id,
        name: i.name,
      };

      payload.push(item);
    }
    return payload;
  }
  return payload;
};

export const generateClassResponse = (classes: ClassEntity[] | null) => {
  const payload: ClassResponse[] = [];
  if (classes && classes.length > 0) {
    for (const i of classes) {
      const item: ClassResponse = {
        id: i.id,
        code: i.code,
        name: i.name,
      };
      payload.push(item);
    }
  }

  return payload;
};
