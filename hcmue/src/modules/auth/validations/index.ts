import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const validateConfirmPassword = (
  password: string,
  confirm_password: string,
  req: Request,
) => {
  if (password !== confirm_password) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.PASSWORD_NO_MATCHING_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }

  return null;
};
