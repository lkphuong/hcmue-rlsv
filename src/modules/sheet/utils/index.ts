import { Request } from 'express';

import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';

import { SheetEntity } from '../../../entities/sheet.entity';
import { returnObjects } from 'src/utils';

import {
  generateSheets2SheetUsuer,
  generateSheets2Class,
  generateData2Object,
} from '../transform/index';
import { QueryRunner } from 'typeorm';

export const generateResponseSheetUser = async (
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', sheets);

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

export const generateStudentUpdateSuccessResponse = async (
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
  console.log('data: ', sheet);

  // Transform SheetEntity class to SheetResponse class
  const payload = await generateData2Object(
    sheet,
    department_service,
    class_service,
    user_service,
    k_service,
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
