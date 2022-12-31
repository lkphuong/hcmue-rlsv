import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { FilesService } from '../../file/services/files.service';
import { SemesterService } from '../../semester/services/semester.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { ErrorMessage } from '../constants/enums/errors.enum';

import {
  DATABASE_EXIT_CODE,
  FILE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { EXCEL_EXTENSION } from '../constants';

export const validateAcademic = async (
  id: number,
  academic_service: AcademicYearService,
  req: Request,
) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.ACADEMIC_ID_EMPTY_ERROR,
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
  } else {
    const academic = await academic_service.getAcademicYearById(id);
    if (!academic) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.ACADEMIC_NOT_FOUND_ERROR, id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }
    return academic;
  }
};

export const validateSemester = async (
  id: number,
  semester_service: SemesterService,
  req: Request,
) => {
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
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else {
    const semester = await semester_service.getSemesterById(id);
    if (!semester) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }
    return semester;
  }
};

export const validateFile = async (
  id: number,
  file_service: FilesService,
  req: Request,
) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.FILE_ID_EMPTY_ERROR,
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
  } else {
    const file = await file_service.getFileById(id);
    if (!file) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.FILE_NOT_FOUND_ERROR, id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    } else {
      if (file.extension.toLowerCase() !== EXCEL_EXTENSION) {
        //#region throw HandlerException
        return new HandlerException(
          FILE_EXIT_CODE.INVALID_EXTENSION,
          req.method,
          req.url,
          ErrorMessage.INVALID_EXTENSION_ERROR,
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
        //#endregion
      }
      return file;
    }
  }
};
