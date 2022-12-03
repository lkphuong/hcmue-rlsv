import { HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { Request } from 'express';

import { HandlerException } from '../../../exceptions/HandlerException';

import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

export const validateUserId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.USER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};
