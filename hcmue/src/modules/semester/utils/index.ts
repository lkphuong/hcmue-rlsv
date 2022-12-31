import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { generateData2Array, generateData2Object } from '../transform';
import { returnObjects } from '../../../utils';

import { SemesterEntity } from '../../../entities/semester.entity';

import {
  CreateSemesterResponse,
  SemesterResponse,
} from '../interfaces/semester_response.interface';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateSemestersResponse = async (
  semesters: SemesterEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', semesters);

  const payload = await generateData2Array(semesters);
  return returnObjects<SemesterResponse>(payload);
};

export const generateSuccessResponse = async (
  semester: SemesterEntity,
  req: Request,
  query_runner?: QueryRunner,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', semester);

  const payload: CreateSemesterResponse = {
    id: semester.id,
    name: semester.name,
    start: semester.start,
    end: semester.end,
  };

  //Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  return returnObjects<CreateSemesterResponse>(payload);
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_SEMESTER_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};
