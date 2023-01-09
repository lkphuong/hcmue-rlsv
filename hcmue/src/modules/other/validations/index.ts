import { HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { Request } from 'express';
import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';
import { sprintf } from '../../../utils';
import { DepartmentService } from '../../department/services/department.service';
import { ErrorMessage } from '../constants/enums/error.enum';
import { OtherService } from '../services/other.service';

export const validateOtherId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.OTHER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateDepartment = async (
  department_id: number,
  department_service: DepartmentService,
  req: Request,
) => {
  const department = await department_service.getDepartmentById(department_id);
  if (!department) {
    return new UnknownException(
      department_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.DEPARTMENT_NOT_FOUND_ERROR, department_id),
    );
  }

  return department;
};

export const validateComparePassword = (
  password: string,
  confirm_password: string,
  req: Request,
) => {
  if (password !== confirm_password) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.PASSWORD_NO_MATCHING_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }
  return null;
};

export const validateAccount = async (
  username: string,
  department_id: number,
  other_service: OtherService,
  req: Request,
) => {
  let other = await other_service.getOtherByDepartment(department_id);

  if (other) {
    return new HandlerException(
      DATABASE_EXIT_CODE.UNIQUE_FIELD_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.DEPARTMENT_HAS_EXIST_ACCOUNT_ERROR, department_id),
      HttpStatus.BAD_REQUEST,
    );
  }

  other = await other_service.contains(username);

  if (other) {
    return new HandlerException(
      DATABASE_EXIT_CODE.UNIQUE_FIELD_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACCOUNT_UNIQUE_ERROR, username),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateAccountByUsername = async (
  username: string,
  other_id: number,
  other_service: OtherService,
  req: Request,
) => {
  const other = await other_service.contains(username, other_id);
  if (other) {
    return new HandlerException(
      DATABASE_EXIT_CODE.UNIQUE_FIELD_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACCOUNT_UNIQUE_ERROR, username),
      HttpStatus.BAD_REQUEST,
    );
  }
  return null;
};

export const validateAccountById = async (
  id: number,
  other_service: OtherService,
  req: Request,
) => {
  const other = await other_service.getOtherById(id);
  if (!other) {
    return new UnknownException(
      id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.OTHER_NOT_FOUND_ERROR, id),
    );
  }

  return other;
};
