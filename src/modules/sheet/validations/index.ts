import { HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';

import { Request } from 'express';

import { HandlerException } from '../../../exceptions/HandlerException';
import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/errors.enum';

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

export const validateId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_NAN_ERROR,
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
  if (from_mark && to_mark) {
    if (mark > to_mark || mark < from_mark) {
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_FORMAT,
        req.method,
        req.url,
        ErrorMessage.MARK_INVALID_FORMAT,
        HttpStatus.BAD_REQUEST,
      );
    }
  } else if (from_mark && from_mark < mark) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.MARK_INVALID_FORMAT,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateRole = (role1: number, role2: number, req: Request) => {
  if (role1 != role2) {
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
