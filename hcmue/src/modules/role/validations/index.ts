import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';
import { isValidObjectId } from 'mongoose';

import { sprintf } from '../../../utils';

import { RoleEntity } from '../../../entities/role.entity';

import { User } from '../../../schemas/user.schema';
import { Department } from '../../../schemas/department.schema';
import { Class } from '../../../schemas/class.schema';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { RoleService } from '../services/role/role.service';
import { UserService } from '../../user/services/user.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const validateClass = async (
  class_id: string,
  department_id: string,
  class_service: ClassService,
  req: Request,
): Promise<Class | HttpException> => {
  const $class = await class_service.getClassById(class_id, department_id);
  if (!$class) {
    return new HandlerException(
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.CLASS_NOT_FOUD_ERROR, class_id),
      HttpStatus.NOT_FOUND,
    );
  }

  return $class;
};

export const validateDepartment = async (
  department_id: string,
  department_service: DepartmentService,
  req: Request,
): Promise<Department | HttpException> => {
  const department = await department_service.getDepartmentById(department_id);
  if (!department) {
    return new HandlerException(
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.DEPARTMENT_NOT_FOUD_ERROR, department_id),
      HttpStatus.NOT_FOUND,
    );
  }

  return department;
};

export const validateRole = async (
  role_id: number,
  role_service: RoleService,
  req: Request,
): Promise<RoleEntity | HttpException> => {
  const role = await role_service.getRoleByCode(role_id);
  if (!role) {
    return new HandlerException(
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ROLE_NOT_FOUND_ERROR, role_id),
      HttpStatus.NOT_FOUND,
    );
  }

  return role;
};

export const validateUser = async (
  user_id: string,
  user_service: UserService,
  req: Request,
): Promise<User | HttpException> => {
  if (isEmpty(user_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.USER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else if (!isValidObjectId(user_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.USER_ID_INVALID_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else {
    const user = await user_service.getUserById(user_id);
    if (!user) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.STUDENT_NOT_FOUND_ERROR, user_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }

    return user;
  }
};
