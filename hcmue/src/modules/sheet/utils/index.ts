import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import {
  convertObjectId2String,
  returnObjects,
  returnObjectsWithPaging,
} from '../../../utils';

import { Class } from '../../../schemas/class.schema';
import { User } from '../../../schemas/user.schema';

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
  ClassSheetsResponse,
} from '../interfaces/sheet_response.interface';

import {
  generateAdminSheets,
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

export const generateClassesResponse = async (
  data: Class[] | null,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', data);

  const classes = await generateClasses2Array(data);

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

export const generateResponses = async (
  pages: number,
  page: number,
  sheets: SheetEntity[],
  users: User[] | null,
  user_service: UserService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', sheets);

  // Transform SheetEntity class to ClassSheetsResponse class
  const payload = await generateAdminSheets(sheets, users, user_service);

  // Returns objects
  return returnObjectsWithPaging<ClassSheetsResponse>(pages, page, payload);
};

export const generateObjectIDString = (object_ids: string[]) => {
  return object_ids.map((value) => `"${value}"`).join(',');
};

export const generateObjectIdFromUsers = (users: User[]) => {
  let user_ids: string[] = null;
  if (users && users.length > 0) {
    user_ids = users.map((user) => user._id.toString());
  }

  return user_ids;
};
