import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { isEmpty } from 'class-validator';

import { sprintf } from 'src/utils';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { SemesterService } from '../../semester/services/semester.service';
import { HeaderService } from '../../header/services/header.service';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

import { ErrorMessage } from '../constants/errors.enum';

export const validateTime = (start: string, end: string, req: Request) => {
  if (new Date(start) > new Date(end)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.TIME_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }
};

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

export const validateFormId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.FORM_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.FORM_ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const validateHeader = async (
  header_id: number,
  header_service: HeaderService,
  req: Request,
) => {
  const header = await header_service.getHeaderById(header_id);
  if (!header) {
    //#region throw HandlerException
    return new UnknownException(
      header_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, header_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return header;
};
