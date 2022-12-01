import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { AcademicYearService } from '../services/academic_year.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

export const validateAcademicYearId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.ACADEMIC_YEAR_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ACADEMIC_YEAR_ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateTimeAcademicYear = (
  from: number,
  to: number,
  req: Request,
) => {
  if (from > to) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.FROM_ACADEMIC_YEAR_INVALID_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateAcademicYearHasForm = async (
  id: number,
  academic_year_service: AcademicYearService,
  req: Request,
) => {
  const academic = await academic_year_service.contains(id);

  if (!academic) {
    return new UnknownException(
      id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_NOT_FOUND_ERROR, id),
    );
  }

  if (academic.forms && academic.forms.length > 0) {
    return new HandlerException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_EXIST_FORM_DONE, id),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateDuplicateAcademicYear = async (
  from: number,
  to: number,
  academic_year_service: AcademicYearService,
  req: Request,
) => {
  const name = `${from}-${to}`;
  const academic_year = await academic_year_service.getAcademicYearByName(name);
  if (academic_year) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.UNIQUE_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_DUPLICATE_ERROR, name),
      HttpStatus.BAD_REQUEST,
    );
  }
  return null;
};
