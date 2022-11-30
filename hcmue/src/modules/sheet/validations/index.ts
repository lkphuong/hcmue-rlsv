import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { convertString2Date, sprintf } from '../../../utils';

import { FormEntity } from '../../../entities/form.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { SheetService } from '../services/sheet.service';

import { RoleCode } from '../../../constants/enums/role_enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const validateClassId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.CLASS_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateDepartmentId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateSheetId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.SHEET_ID_EMPTY_ERROR,
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

export const validateUserId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.USER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateMark = (
  mark: number,
  from_mark: number,
  to_mark: number,
  req: Request,
) => {
  if (from_mark != 0 && to_mark != 0) {
    if (mark > to_mark || mark < from_mark) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_FORMAT,
        req.method,
        req.url,
        sprintf(ErrorMessage.RANGE_MARK_INVALID_FORMAT, from_mark, to_mark),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
  } else if (from_mark != 0 && from_mark < mark) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      sprintf(ErrorMessage.SINGLE_MARK_INVALID_FORMAT, from_mark),
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }

  return null;
};

export const validateRole = (role1: number, role2: number, req: Request) => {
  if (role1 != role2 && role2 != RoleCode.ADMIN) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.FORBIDDEN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateSheet = async (
  id: number,
  sheet_service: SheetService,
  req: Request,
): Promise<SheetEntity | HttpException> => {
  const sheet = await sheet_service.getSheetById(id);
  if (!sheet) {
    //#region throw HandlerException
    return new HandlerException(
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return sheet;
};

export const validateTime = async (
  form: FormEntity,
  role: RoleCode,
  req: Request,
) => {
  const current = new Date();
  if (role === RoleCode.STUDENT) {
    //#region Validate student time
    if (
      current < convertString2Date(form.student_start.toString()) ||
      current > convertString2Date(form.student_end.toString())
    ) {
      return new HandlerException(
        VALIDATION_EXIT_CODE.NO_MATCHING,
        req.method,
        req.url,
        sprintf(ErrorMessage.OUT_OF_EVALUATE_TIME_ERROR, role, current),
        HttpStatus.BAD_REQUEST,
      );
    }
    //#endregion
  } else if (role === RoleCode.CLASS) {
    //#region Validate class time
    if (
      current < convertString2Date(form.class_start.toString()) ||
      current > convertString2Date(form.class_end.toString())
    ) {
      return new HandlerException(
        VALIDATION_EXIT_CODE.NO_MATCHING,
        req.method,
        req.url,
        sprintf(ErrorMessage.OUT_OF_EVALUATE_TIME_ERROR, role, current),
        HttpStatus.BAD_REQUEST,
      );
    }
    //#endregion
  } else if (role == RoleCode.DEPARTMENT) {
    //#region Validate department time
    if (
      current < convertString2Date(form.department_start.toString()) ||
      current > convertString2Date(form.department_end.toString())
    ) {
      return new HandlerException(
        VALIDATION_EXIT_CODE.NO_MATCHING,
        req.method,
        req.url,
        sprintf(ErrorMessage.OUT_OF_EVALUATE_TIME_ERROR, role, current),
        HttpStatus.BAD_REQUEST,
      );
    }
    //#endregion
  }

  return null;
};
