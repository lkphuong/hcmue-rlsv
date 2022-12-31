import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { RoleEntity } from '../../../entities/role.entity';

import { UserEntity } from '../../../entities/user.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { ClassEntity } from '../../../entities/class.entity';

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
  class_id: number,
  class_service: ClassService,
  req: Request,
): Promise<ClassEntity | HttpException> => {
  const $class = await class_service.getClassById(class_id);
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
  department_id: number,
  department_service: DepartmentService,
  req: Request,
): Promise<DepartmentEntity | HttpException> => {
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
  user_id: number,
  user_service: UserService,
  req: Request,
): Promise<UserEntity | HttpException> => {
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
  } else if (isNaN(user_id)) {
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

    return user[0];
  }
};
