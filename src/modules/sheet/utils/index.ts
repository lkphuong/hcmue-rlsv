import { Request } from 'express';

import { returnObjects } from 'src/utils';

import { SheetEntity } from '../../../entities/sheet.entity';

import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { FormService } from '../../form/services/form.service';

import { MultiApproveResponse } from '../interfaces/sheet_response.interface';

import {
  generateSheets2Class,
  generateSheets2SheetUsuer,
} from '../transform/index';
import { QueryRunner } from 'typeorm';
import { FormEntity } from 'src/entities/form.entity';
import { EvaluationEntity } from 'src/entities/evaluation.entity';

export const generateResponseSheetUser = async (
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

// export const generateUpdateSuccessResponse = async (
//   sheet: SheetEntity,
//   class_service: ClassService,
//   department_service: DepartmentService,
//   k_service: KService,
//   user_service: UserService,
//   query_runner: QueryRunner,
//   req: Request,
// ) => {
//   console.log('----------------------------------------------------------');
//   console.log(req.method + ' - ' + req.url);

//   // Transform SheetEntity class to SheetResponse class
//   const payload = await generateData2Object(
//     sheet,
//     department_service,
//     class_service,
//     user_service,
//     k_service,
//   );

//   if (payload) {
//     // Commit transaction
//     if (query_runner) await query_runner.commitTransaction();
//   } else {
//     // Rollback transaction
//     await query_runner.rollbackTransaction();

//     // Release transaction
//     await query_runner.release();
//   }

//   return {
//     data: payload,
//     errorCode: 0,
//     message: null,
//     errors: null,
//   };
// };

// export const generateMultiApproveSuccessResponse = async (
//   sheet_ids: number[],
//   success: boolean,
// ) => {
//   const payload: MultiApproveResponse = {
//     sheet_ids: sheet_ids,
//     success: success,
//   };
//   return returnObjects(payload);
// };

// export const generateDetailSheet = async (
//   sheet: SheetEntity,
//   forms: FormEntity[] | null,
//   evaluations: EvaluationEntity[] | null,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
//   req: Request,
// ) => {
//   console.log('----------------------------------------------------------');
//   console.log(req.method + ' - ' + req.url);
//   console.log('data: ', sheet);

//   const payload = await generateDetailSheet2Object(
//     sheet,
//     evaluations,
//     forms,
//     evaluation_service,
//     form_service,
//   );

//   return returnObjects(payload);
// };

// export const generateChildren2ArrayResponse = async (
//   forms: FormEntity[],
//   form_service: FormService,
//   req: Request,
// ) => {
//   console.log('----------------------------------------------------------');
//   console.log(req.method + ' - ' + req.url);
//   console.log('data: ', forms);

//   const payload = await generateChildren2Array(forms, form_service);

//   return returnObjects(payload);
// };
