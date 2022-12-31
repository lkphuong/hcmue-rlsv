import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { SemesterService } from '../services/semester.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const validateId = (id: number, req: Request): HttpException | null => {
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

export const validateDateAcademic = async (
  academic_id: number,
  start: Date,
  end: Date,
  academic_year_service: AcademicYearService,
  req: Request,
): Promise<HttpException | null> => {
  const academic = await academic_year_service.getAcademicYearById(academic_id);
  const year_start = new Date(start).getFullYear();
  const year_end = new Date(end).getFullYear();
  if (
    (year_start !== academic.start && year_start !== academic.end) ||
    (year_end !== academic.start && year_end !== academic.end)
  ) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      sprintf(
        ErrorMessage.TIME_SEMESTER_NO_MATCHING_ERROR,
        academic.start + ' - ' + academic.end,
      ),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const isUsed = async (
  id: number,
  semester_service: SemesterService,
  req: Request,
): Promise<HttpException | null> => {
  const semester = await semester_service.contains(id);
  if (!semester) {
    return new UnknownException(
      id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, id),
    );
  } else if (semester.forms && semester.forms.length > 0) {
    return new HandlerException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      sprintf(ErrorMessage.UNLINK_SEMESTER_IN_ANY_FORM_ERROR, id),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateTime = (start: Date, end: Date, req: Request) => {
  if (start > end) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.TIME_SEMESTER_INVALID_DATES_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};
