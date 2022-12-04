import { RoleEntity } from '../../../entities/role.entity';
import { RoleUserResponse } from '../interfaces/assign-user-role-response.interface';

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
