import { HttpException, HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { Request } from 'express';
import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from 'src/constants/enums/error-code.enum';
import { FormEntity } from 'src/entities/form.entity';
import { HeaderEntity } from 'src/entities/header.entity';
import { HandlerException } from 'src/exceptions/HandlerException';
import { UnknownException } from 'src/exceptions/UnknownException';
import { HeaderService } from 'src/modules/header/services/header.service';
import { sprintf } from 'src/utils';
import { ErrorMessage } from '../constants/errors.enum';
import { FormService } from '../services/form.service';

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

  return null;
};

export const validateHeaderId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.HEADER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.HEADER_ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateHeader = async (
  header_id: number,
  header_service: HeaderService,
  req: Request,
): Promise<HeaderEntity | HttpException> => {
  const header = await header_service.getHeaderById(header_id);

  if (!header) {
    return new UnknownException(
      header_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, header_id),
    );
  }

  return header;
};

export const validateForm = async (
  form_id: number,
  form_ervice: FormService,
  req: Request,
): Promise<FormEntity | HttpException> => {
  const form = await form_ervice.getFormById(form_id);

  if (!form) {
    return new UnknownException(
      form_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
    );
  }

  return form;
};
