import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { sprintf } from '../../../utils';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { SemesterService } from '../../semester/services/semester.service';
import { UserService } from '../../user/services/user.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { RoleCode } from '../../../constants/enums/role_enum';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const validateAcademicYear = async (
  academic_id: number,
  academic_service: AcademicYearService,
  req: Request,
) => {
  const academic = await academic_service.getAcademicYearById(academic_id);
  if (!academic) {
    //#region throw HandlerException
    return new UnknownException(
      academic_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_NOT_FOUND_ERROR, academic_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return academic;
};

export const validateClass = async (
  class_id: number | null,
  class_service: ClassService,
  req: Request,
) => {
  if (class_id) {
    const classes = await class_service.getClassById(class_id);
    if (!classes) {
      //#region throw HandlerException
      return new UnknownException(
        class_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.CLASS_NOT_FOUND_ERROR, class_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }

    return classes;
  }

  return null;
};

export const validateDepartment = async (
  department_id: number | null,
  department_service: DepartmentService,
  req: Request,
) => {
  if (department_id) {
    const department = await department_service.getDepartmentById(
      department_id,
    );
    if (!department) {
      //#region throw HandlerException
      return new UnknownException(
        department_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.DEPARTMENT_NOT_FOUND_ERROR, department_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }

    return department;
  }
  return null;
};

export const validateRole = async (
  department_id: number,
  role: number,
  user_id: number,
  user_service: UserService,
  req: Request,
) => {
  if (role !== RoleCode.ADMIN) {
    const user = await user_service.getUserById(user_id);
    if (user && user.department_id !== department_id) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.ROLE_INVALID_ERROR, user.department.name),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
  }

  return null;
};

export const validateSemester = async (
  semester_id: number,
  semester_service: SemesterService,
  req: Request,
) => {
  const semester = await semester_service.getSemesterById(semester_id);
  if (!semester) {
    //#region throw HandlerException
    return new UnknownException(
      semester_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, semester_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return semester;
};
