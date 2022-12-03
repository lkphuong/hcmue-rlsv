import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { AcademicYearService } from '../services/academic_year.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const validateAcademicYearId = (
  id: number,
  req: Request,
): HttpException | null => {
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

export const validateYears = (
  from: number,
  to: number,
  req: Request,
): HttpException | null => {
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

export const isDuplicated = async (
  from: number,
  to: number,
  academic_year_service: AcademicYearService,
  req: Request,
): Promise<HttpException | null> => {
  const name = `${from}-${to}`;
  const academic_year = await academic_year_service.getAcademicYearByName(name);
  if (academic_year) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.UNIQUE_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_DUPLICATE_ERROR, name),
      HttpStatus.AMBIGUOUS,
    );
  }

  return null;
};

export const isUsed = async (
  id: number,
  academic_year_service: AcademicYearService,
  req: Request,
): Promise<HttpException | null> => {
  const academic = await academic_year_service.contains(id);
  if (!academic) {
    return new UnknownException(
      id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_NOT_FOUND_ERROR, id),
    );
  } else if (academic.forms && academic.forms.length > 0) {
    return new HandlerException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      sprintf(ErrorMessage.UNLINK_ACADEMIC_YEAR_IN_ANY_FORM_ERROR, id),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};
