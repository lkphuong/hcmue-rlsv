import { QueryRunner } from 'typeorm';
import { Request } from 'express';
import { returnObjects } from '../../../utils';

import { SheetEntity } from '../../../entities/sheet.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';

import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';

import { MultiApproveResponse } from '../interfaces/sheet_response.interface';

import {
  generateData2Object,
  generateDetailTile2Object,
  generateEvaluation2Array,
  generateSheets2Class,
  generateSheets2SheetUsuer,
} from '../transform/index';

export const generateResponseSheetUser = (
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to
  const payload = generateSheets2SheetUsuer(sheets);

  // Returns data
  return returnObjects(payload);
};

export const generateResponseSheetClass = async (
  input: string,
  sheets: SheetEntity[],
  user_service: UserService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', sheets);

  // Transform SheetEntity class to
  const payload = await generateSheets2Class(sheets, user_service, input);

  // Returns data
  return returnObjects(payload);
};

export const generateUpdateSuccessResponse = async (
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
    department_service,
    class_service,
    user_service,
    k_service,
  );

  if (payload) {
    // Commit transaction
    if (query_runner) await query_runner.commitTransaction();
  } else {
    // Rollback transaction
    await query_runner.rollbackTransaction();

    // Release transaction
    await query_runner.release();
  }

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateMultiApproveSuccessResponse = (
  sheet_ids: number[],
  success: boolean,
) => {
  const payload: MultiApproveResponse = {
    sheet_ids: sheet_ids,
    success: success,
  };
  return returnObjects(payload);
};

export const generateDetailSheet = async (
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
    department_service,
    class_service,
    user_service,
    k_service,
  );

  return returnObjects(payload);
};

export const generateDataTitleResponse = (
  items: ItemEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', items);

  const payload = generateDetailTile2Object(items);

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateDataEvaluationResponse = (
  evaluations: EvaluationEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', evaluations);

  const payload = generateEvaluation2Array(evaluations);

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};
