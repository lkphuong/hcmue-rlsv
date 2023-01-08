import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import * as md5 from 'md5';

import { generateFailedResponse, generateSuccessResponse } from '../utils';

import {
  validateDepartment,
  validateComparePassword,
  validateAccount,
  validateAccountById,
  validateAccountByUsername,
} from '../validations';

import { OtherEntity } from '../../../entities/other.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';

import { CreateAccountDto } from '../dtos/create_account.dto';
import { UpdateAccountDto } from '../dtos/update_account.dto';

import { OtherService } from '../services/other.service';
import { DepartmentService } from '../../department/services/department.service';
import { RoleService } from '../../role/services/role/role.service';
import { RoleUsersService } from '../../role/services/role_users/role_users.service';

import { OtherCategory } from '../constants/enums/category.enum';
import { ErrorMessage } from '../constants/enums/error.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const createAccountDepartment = async (
  params: CreateAccountDto,
  department_service: DepartmentService,
  other_service: OtherService,
  role_user_service: RoleUsersService,
  role_service: RoleService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Get params
  const { confirm_password, department_id, password, username } = params;
  //#endregion

  //#region Validation
  //#region Validate department
  const valid_department = await validateDepartment(
    department_id,
    department_service,
    req,
  );
  if (valid_department instanceof HttpException) throw valid_department;
  //#endregion

  //#region Validate password
  const valid_password = await validateComparePassword(
    password,
    confirm_password,
    req,
  );
  if (valid_password instanceof HttpException) throw valid_password;
  //#endregion

  //#region Validate account
  const valid_account = await validateAccount(
    username,
    department_id,
    other_service,
    req,
  );
  if (valid_account instanceof HttpException) throw valid_account;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region generate other
    let other = new OtherEntity();
    other.category = OtherCategory.DEPARTMENT;
    other.username = username;
    other.password = md5(password);
    other.department_id = department_id;
    other.active = true;

    other = await other_service.add(other, query_runner.manager);
    //#endregion

    if (other) {
      //#region Get role department
      const role_department = await role_service.getRoleByCode(
        RoleCode.DEPARTMENT,
      );
      //#endregion

      //#region generate role users
      let role_user = new RoleUsersEntity();
      role_user.department_id = department_id;
      role_user.std_code = other.id.toString();
      role_user.role = role_department;
      role_user.active = true;
      role_user.created_at = new Date();

      role_user = await role_user_service.add(role_user);
      //#endregion

      if (role_user) {
        //#region Generate response
        return await generateSuccessResponse(other, query_runner, req);
        //#endregion
      }
    }
    //#region throw HandlerException
    return generateFailedResponse(req, ErrorMessage.OPERATOR_OTHER_ERROR);
    //#endregion
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

export const updateAccountDepartment = async (
  id: number,
  params: UpdateAccountDto,
  other_service: OtherService,
  req: Request,
) => {
  //#region Get params
  const { username } = params;
  //#endregion

  //#region Validate Account
  //#region Validate Account By Id
  let other = await validateAccountById(id, other_service, req);
  if (other instanceof HttpException) throw other;
  //#endregion

  //#region Validate Account by username
  const valid = await validateAccountByUsername(
    username,
    id,
    other_service,
    req,
  );
  //#endregion
  if (valid instanceof HttpException) throw valid;

  //#region Update new username
  other.username = username;
  other.active = true;
  other.updated_at = new Date();

  other = await other_service.update(other);
  //#endregion

  if (other) {
    //#region Generate response
    return await generateSuccessResponse(other, null, req);
    //#endregion
  } else {
    //#region throw HandlerException
    return generateFailedResponse(req, ErrorMessage.OPERATOR_OTHER_ERROR);
    //#endregion
  }
};

export const unlinkAccountDepartment = async (
  other_id: number,
  other_service: OtherService,
  role_user_service: RoleUsersService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Validate account
  const other = await validateAccountById(other_id, other_service, req);
  if (other instanceof HttpException) throw other;
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Unlink account department
    let result = await other_service.unlink(other_id, query_runner.manager);
    //#endregion

    if (result) {
      //#region Unlink role user
      result = await role_user_service.unlink(
        other_id.toString(),
        query_runner.manager,
      );
      //#endregion

      if (result) {
        //#region Generate response
        return await generateSuccessResponse(other, query_runner, req);
        //#endregion
      }

      //#region throw HandlerException
      return generateFailedResponse(req, ErrorMessage.OPERATOR_OTHER_ERROR);
      //#endregion
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
