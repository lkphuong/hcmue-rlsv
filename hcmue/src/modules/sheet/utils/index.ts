import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import {
  convertObjectId2String,
  returnObjects,
  returnObjectsWithPaging,
} from '../../../utils';

import { ClassEntity } from '../../../entities/class.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';
import { UserEntity } from '../../../entities/user.entity';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { UserService } from '../../user/services/user.service';
import { FilesService } from '../../file/services/files.service';

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
  data: ClassEntity[] | null,
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
  users: UserEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  //console.log('data: ', sheets);

  // Transform SheetEntity to ClassSheetsResponse
  const payload = await generateClassSheets(sheets);

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
  role: number,
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
    role,
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
  role: number,
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
    role,
    class_service,
    department_service,
    k_service,
    user_service,
  );

  return returnObjects(payload);
};

export const generateItemsResponse = async (
  role: number,
  items: ItemEntity[],
  base_url: string,
  file_service: FilesService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', items);

  const payload = await generateItemsArray(role, items, base_url, file_service);

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateEvaluationsResponse = async (
  role: number,
  evaluations: EvaluationEntity[],
  base_url: string,
  file_service: FilesService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', evaluations);

  const payload = await generateEvaluationsArray(
    role,
    evaluations,
    base_url,
    file_service,
  );

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
  user_service: UserService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', sheets);

  // Transform SheetEntity class to ClassSheetsResponse class
  const payload = await generateAdminSheets(sheets, user_service);

  // Returns objects
  return returnObjectsWithPaging<ClassSheetsResponse>(pages, page, payload);
};

export const generateObjectIDString = (object_ids: string[]) => {
  return object_ids.map((value) => `"${value}"`).join(',');
};

export const generateObjectIdFromUsers = (users: UserEntity[]) => {
  let user_ids: number[] = null;
  if (users && users.length > 0) {
    user_ids = users.map((user) => user.id);
  }

  return user_ids;
};
