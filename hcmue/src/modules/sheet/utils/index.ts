import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { convertObjectId2String, returnObjects } from '../../../utils';

import { AcademicYearClassesEntity } from '../../../entities/academic_year_classes.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { UserService } from '../../user/services/user.service';

import {
  ApproveAllResponse,
  BaseResponse,
} from '../interfaces/sheet_response.interface';

import {
  generateClasses2Array,
  generateClassSheets,
  generateData2Object,
  generateEvaluationsArray,
  generateItemsArray,
  generateUserSheets,
} from '../transform/index';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { User } from 'src/schemas/user.schema';

export const generateClassesResponse = async (
  department_id: string,
  data: AcademicYearClassesEntity[] | null,
  class_service: ClassService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', data);

  const classes = await generateClasses2Array(
    department_id,
    data,
    class_service,
  );

  // Returns object
  return returnObjects<BaseResponse>(classes);
};

export const generateUserSheetsResponse = (
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to UserSheetsResponse
  const payload = generateUserSheets(sheets);

  // Returns data
  return returnObjects(payload);
};

export const generateClassSheetsResponse = async (
  sheets: SheetEntity[],
  users: User[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  //console.log('data: ', sheets);

  // Transform SheetEntity to ClassSheetsResponse
  const payload = await generateClassSheets(users, sheets);

  // Returns data
  return returnObjects(payload);
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_SHEET_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};

export const generateSuccessResponse = async (
  sheet: SheetEntity,
  class_service: ClassService,
  department_service: DepartmentService,
  k_service: KService,
  user_service: UserService,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to SheetResponse class
  const payload = await generateData2Object(
    sheet,
    class_service,
    department_service,
    k_service,
    user_service,
  );

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateApproveAllResponse = (
  sheet_ids: number[],
  success: boolean,
) => {
  const payload: ApproveAllResponse = {
    sheet_ids: sheet_ids,
    success: success,
  };

  return returnObjects<ApproveAllResponse>(payload);
};

export const generateSheet = async (
  sheet: SheetEntity,
  department_service: DepartmentService,
  class_service: ClassService,
  user_service: UserService,
  k_service: KService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', sheet);

  const payload = await generateData2Object(
    sheet,
    class_service,
    department_service,
    k_service,
    user_service,
  );

  return returnObjects(payload);
};

export const generateItemsResponse = (items: ItemEntity[], req: Request) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', items);

  const payload = generateItemsArray(items);

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateEvaluationsResponse = (
  evaluations: EvaluationEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', evaluations);

  const payload = generateEvaluationsArray(evaluations);

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const groupItemsByHeader = <T>(
  data: T[] | null,
  key: number | string,
) => {
  if (data) {
    const items = data.reduce((r, a) => {
      r[a[key]] = [...(r[a[key]] || []), a];
      return r;
    }, {});

    const results = Object.keys(items).map((key) => [Number(key), items[key]]);

    return results;
  }

  return null;
};

export const mapUserForSheet = (
  user_id: string,
  sheets: SheetEntity[] | null,
) => {
  if (sheets) {
    const result = sheets.find(
      (e) => e.user_id == convertObjectId2String(user_id),
    );

    if (result) return result;
  }
  return null;
};
