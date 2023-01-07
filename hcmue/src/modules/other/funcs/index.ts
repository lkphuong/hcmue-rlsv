import { HttpException } from '@nestjs/common';
import { Request } from 'express';

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

import { CreateAccountDto } from '../dtos/create_account.dto';

import { OtherService } from '../services/other.service';
import { DepartmentService } from '../../department/services/department.service';

import { OtherCategory } from '../constants/enums/category.enum';
import { ErrorMessage } from '../constants/enums/error.enum';
import { UpdateAccountDto } from '../dtos/update_account.dto';

export const createAccountDepartment = async (
  params: CreateAccountDto,
  department_service: DepartmentService,
  other_service: OtherService,
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

  //#region generate other
  let other = new OtherEntity();
  other.category = OtherCategory.DEPARTMENT;
  other.username = username;
  other.password = md5(password);
  other.department_id = department_id;
  other.active = true;

  other = await other_service.add(other);
  //#endregion

  if (other) {
    //#region Generate response
    return await generateSuccessResponse(other, req);
    //#endregion
  } else {
    //#region throw HandlerException
    return generateFailedResponse(req, ErrorMessage.OPERATOR_OTHER_ERROR);
    //#endregion
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
    return await generateSuccessResponse(other, req);
    //#endregion
  } else {
    //#region throw HandlerException
    return generateFailedResponse(req, ErrorMessage.OPERATOR_OTHER_ERROR);
    //#endregion
  }
};
