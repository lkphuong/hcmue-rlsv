import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { generateData2Array, generateData2Object } from '../transform';
import { returnObjects } from '../../../utils';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';

import { AcademicYearResponse } from '../interfaces/academic_year_response.interface';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateAcademicsResponse = async (
  academics: AcademicYearEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', academics);

  const payload = await generateData2Array(academics);
  return returnObjects<AcademicYearResponse>(payload);
};

export const generateSuccessResponse = async (
  academic: AcademicYearEntity,
  req: Request,
  query_runner?: QueryRunner,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', academic);

  const payload = await generateData2Object(academic);

  //Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  return returnObjects<AcademicYearResponse>(payload);
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_ACADEMIC_YEAR_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};
