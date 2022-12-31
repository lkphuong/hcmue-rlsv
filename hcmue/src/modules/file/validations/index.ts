import { HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { Request } from 'express';

import { sprintf } from '../../../utils';

import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

import { HandlerException } from '../../../exceptions/HandlerException';

import { UserService } from '../../user/services/user.service';

export const validateFileUser = async (
  request_code: string, //req
  std_code: string, // created_by
  user_service: UserService,
  req: Request,
) => {
  const user = await user_service.getUserByCode(request_code);

  if (user.std_code !== std_code) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.STUDENT_ROLE_INVALID_ERROR, user.fullname),
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }
};

export const validateFileId = (id: number, req: Request) => {
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
  }

  return null;
};
