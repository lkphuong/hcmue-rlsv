import { VALIDATION_EXIT_CODE } from 'src/constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { isEmpty } from 'class-validator';
import { Request } from 'express';

import { HandlerException } from 'src/exceptions/HandlerException';
import { HttpStatus } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { sprintf } from 'src/utils';

export const validateFileUser = async (
  request_id: number, //req
  user_id: number, // created_by
  user_service: UserService,
  req: Request,
) => {
  const user = await user_service.getUserById(user_id);

  if (user._id.toString() !== request_id) {
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
