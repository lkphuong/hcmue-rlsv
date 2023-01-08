import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { QueryRunner } from 'typeorm';

import { returnObjects } from '../../../utils';

import { OtherEntity } from '../../../entities/other.entity';

import { HandlerException } from '../../../exceptions/HandlerException';

import { OtherResponse } from '../interfaces/other_response.interface';

import { ErrorMessage } from '../constants/enums/error.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateSuccessResponse = async (
  other: OtherEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', other);

  const payload: OtherResponse = { username: other.username };

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  return returnObjects<OtherResponse>(payload);
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_OTHER_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};
