import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { SemesterService } from '../services/semester.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

export const validateSemesterId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.SEMESTER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.SEMESTER_ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateDuplicateSemester = async (
  name: string,
  semester_service: SemesterService,
  req: Request,
) => {
  const semester = await semester_service.getSemesterByName(name);

  if (semester) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.UNIQUE_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_DUPLICATE_ERROR, name),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateSemesterHasForm = async (
  id: number,
  semester_service: SemesterService,
  req: Request,
) => {
  const semester = await semester_service.contains(id);

  if (!semester) {
    return new UnknownException(
      id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, id),
    );
  }

  if (semester.forms && semester.forms.length > 0) {
    return new HandlerException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_EXIST_FORM_DONE, id),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};
