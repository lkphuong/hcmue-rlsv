import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { QueryRunner } from 'typeorm';

import { returnObjects, returnObjectsWithPaging } from '../../../utils';

import { OtherEntity } from '../../../entities/other.entity';

import { DepartmentEntity } from '../../../entities/department.entity';
import { OtherService } from '../services/other.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { generateData2Array, generateData2Object } from '../transform';

import {
  AccountDepartmentResponse,
  OtherResponse,
} from '../interfaces/other_response.interface';

import { ErrorMessage } from '../constants/enums/error.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateSuccessResponse = async (
  other: OtherEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

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

export const generateDepartmentResponse = async (
  department: DepartmentEntity,
  other_service: OtherService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateData2Object(department, other_service);

  return returnObjects<AccountDepartmentResponse>(payload);
};

export const generateDepartmentsResponse = async (
  pages: number,
  page: number,
  departments: DepartmentEntity[],
  other_service: OtherService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateData2Array(departments, other_service);

  // Returns object
  return returnObjectsWithPaging<AccountDepartmentResponse>(
    pages,
    page,
    payload,
  );
};
