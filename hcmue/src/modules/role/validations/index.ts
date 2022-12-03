import { RoleCode } from '../../../constants/enums/role_enum';
import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { RoleUsersService } from '../services/role_users/role_users.service';

// export const validateRole = async (
//   user_id: string,
//   role_id: number,
//   class_id: string,
//   department_id: string,
//   role_user_service: RoleUsersService,
// ) => {
//   let role_user: RoleUsersEntity | null = null;
//   if (role_id == RoleCode.CLASS || role_id == RoleCode.STUDENT) {
//     console.log('1');
//     role_user = await role_user_service.getRoleUser(
//       user_id,
//       role_id,
//       department_id,
//       class_id,
//     );
//   } else if (role_id == RoleCode.DEPARTMENT) {
//     console.log('2');
//     role_user = await role_user_service.getRoleUser(
//       user_id,
//       role_id,
//       department_id,
//       null,
//     );
//   }

//   return role_user;
// };
