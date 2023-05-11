import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { AdviserEntity } from '../../../entities/adviser.entity';
import { generateResponse } from '../transform';

import { returnObjectsWithPaging } from '../../../utils';

import { GetAdviserResponse } from '../interfaces/adviser-response.interface';
import { HandlerException } from '../../../exceptions/HandlerException';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateImportSuccessResponse = async (
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  // Return object
  return {
    data: 'Thành công',
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponses = async (
  pages: number,
  page: number,
  advisers: AdviserEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform UserEntity class to UserResponse class
  const payload = await generateResponse(advisers);

  // Returns objects
  return returnObjectsWithPaging<GetAdviserResponse>(pages, page, payload);
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.ADVISER_OPERATOR_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};
