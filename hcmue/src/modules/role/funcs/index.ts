import { DataSource } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Request } from 'express';

import { generateFailedResponse, generateSuccessResponse } from '../utils';

import { RoleEntity } from '../../../entities/role.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';

import { RoleUsersService } from '../services/role_users/role_users.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const createRoleUser = async (
  request_code: string,
  class_id: number,
  department_id: number,
  std_code: string,
  role: RoleEntity,
  role_user_service: RoleUsersService,
  data_source: DataSource,
  req: Request,
) => {
  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Update old role user
    const old_role_user = await role_user_service.checkRoleUser(
      department_id,
      role.code,
      class_id,
    );
    if (old_role_user) {
      await role_user_service.unlink(
        old_role_user.std_code,
        query_runner.manager,
      );
    }
    //#endregion

    //#region Get role user
    let role_user = await role_user_service.getRoleUserByStdCode(std_code);
    if (role_user) {
      //#region Update role_user
      role_user.department_id = department_id;
      role_user.class_id = class_id;
      role_user.role = role;
      role_user.updated_at = new Date();
      role_user.updated_by = request_code;

      role_user = await role_user_service.update(
        role_user,
        query_runner.manager,
      );
      //#endregion
    } else {
      //#region Create new role_user
      role_user = new RoleUsersEntity();
      role_user.std_code = std_code;
      role_user.department_id = department_id;
      role_user.class_id = class_id;
      role_user.role = role;
      role_user.created_at = new Date();
      role_user.created_by = request_code;
      role_user = await role_user_service.add(role_user, query_runner.manager);
      //#endregion
    }
    //#endregion

    if (role_user) {
      //#region Generate response
      return await generateSuccessResponse(role, query_runner, req);
      //#endregion
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_ROLE_USER_ERROR);
    }
  } catch (err) {
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('--------------------------------------------------------');
    console.log(req.method + ' - ' + req.url + ': ' + err.message);

    if (err instanceof HttpException) return err;
    else {
      //#region throw HandlerException
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
      //#endregion
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};
