import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { ErrorMessage } from '../constants/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const validateDepartmentId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};
