import { HttpException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import e, { Request } from 'express';

import { sprintf } from 'src/utils';
// import { generateUpdateSuccessResponse } from '../utils';

import { SheetEntity } from '../../../entities/sheet.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';

import { UnknownException } from '../../../exceptions/UnknownException';
import { HandlerException } from 'src/exceptions/HandlerException';

import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { FormService } from '../../form/services/form.service';
import { LevelService } from '../../level/services/level.service';
import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { SheetService } from '../services/sheet.service';
import { ApprovalService } from '../../approval/services/approval.service';
import { ItemService } from '../../item/services/item.service';
import { OptionService } from '../../option/services/option.service';

import { UpdateMarkStudent } from '../dtos/update_mark_student.dto';
import { UpdateMarkClass } from '../dtos/update_mark_class.dto';
import { UpdateMarkDepartment } from '../dtos/update_mark_department.dto';

import { HttpResponse } from 'src/interfaces/http-response.interface';
import { SheetDetailResponse } from '../interfaces/sheet_response.interface';

import {
  validateApprovalTime,
  validateMark,
  validateMarkLevel,
  validateRole,
} from '../validations';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from 'src/constants/enums/error-code.enum';
import { StatusSheet } from '../constants/status.enum';
import { ErrorMessage } from '../constants/errors.enum';
import { OptionEntity } from 'src/entities/option.entity';

// export const updateEvaluationPersonal = async (
//   sheet_id: number,
//   role: number,
//   user_id: string,
//   params: UpdateMarkStudent,
//   approval_service: ApprovalService,
//   sheet_service: SheetService,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
//   level_service: LevelService,
//   department_service: DepartmentService,
//   class_service: ClassService,
//   k_service: KService,
//   user_service: UserService,
//   data_source: DataSource,
//   req: Request,
// ): Promise<HttpResponse<SheetDetailResponse> | HttpException> => {
//   //#region
//   const { role_id } = params;
//   //#endregion

//   //#region Validation

//   //#region Validate role
//   const vali_role = validateRole(role_id, role, req);
//   if (vali_role instanceof HttpException) throw vali_role;
//   //#endregion

//   //#region Validate approval
//   const vali_approval = await validateApprovalTime(
//     sheet_id,
//     role,
//     approval_service,
//     req,
//   );
//   if (vali_approval instanceof HttpException) throw vali_approval;
//   //#endregion
//   //#endregion

//   const sheet = await sheet_service.getSheetById(sheet_id);
//   if (sheet) {
//     // Make the QueryRunner
//     const query_runner = data_source.createQueryRunner();

//     // Establish real database connection
//     await query_runner.connect();

//     try {
//       // Start transaction
//       await query_runner.startTransaction();

//       //#region Update sheet
//       const result = await generateUpdatePersonalMark(
//         user_id,
//         params,
//         sheet,
//         sheet_service,
//         level_service,
//         query_runner,
//         req,
//       );
//       //#endregion

//       if (result instanceof HttpException) throw result;

//       if (result) {
//         let success: EvaluationEntity[] | HttpException | null = null;

//         //#region
//         success = await updateMarkStudent(
//           user_id,
//           params,
//           sheet,
//           evaluation_service,
//           form_service,
//           query_runner,
//           req,
//         );
//         //#endregion

//         if (success instanceof HttpException) throw success;

//         return await generateUpdateSuccessResponse(
//           sheet,
//           class_service,
//           department_service,
//           k_service,
//           user_service,
//           query_runner,
//           req,
//         );
//       }
//     } catch (err) {
//       // Rollback transaction
//       await query_runner.rollbackTransaction();

//       console.log('--------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) return err;
//       else {
//         //#region throw HandlerException
//         return new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//         //#endregion
//       }
//     } finally {
//       // Release transaction
//       await query_runner.release();
//     }
//   } else {
//     //#region throw HandlerException
//     return new UnknownException(
//       sheet_id,
//       DATABASE_EXIT_CODE.UNKNOW_VALUE,
//       req.method,
//       req.url,
//       sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
//     );
//     //#endregion
//   }
// };

// export const updateEvaluationClass = async (
//   sheet_id: number,
//   role: number,
//   user_id: string,
//   params: UpdateMarkClass,
//   approval_service: ApprovalService,
//   sheet_service: SheetService,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
//   level_service: LevelService,
//   department_service: DepartmentService,
//   class_service: ClassService,
//   k_service: KService,
//   user_service: UserService,
//   data_source: DataSource,
//   req: Request,
// ): Promise<HttpResponse<SheetDetailResponse> | HttpException> => {
//   //#region Get params
//   const { role_id } = params;
//   //#endregion

//   //#region Validation
//   //#region Validate role
//   const vali_role = validateRole(role_id, role, req);
//   if (vali_role instanceof HttpException) throw vali_role;
//   //#endregion

//   //#region Validate approval
//   const vali_approval = await validateApprovalTime(
//     sheet_id,
//     role,
//     approval_service,
//     req,
//   );
//   if (vali_approval instanceof HttpException) throw vali_approval;
//   //#endregion
//   //#endregion

//   const sheet = await sheet_service.getSheetById(sheet_id);
//   if (sheet) {
//     // Make the QueryRunner
//     const query_runner = data_source.createQueryRunner();

//     // Establish real database connection
//     await query_runner.connect();

//     try {
//       // Start transaction
//       await query_runner.startTransaction();

//       //#region Update sheet
//       const result = await generateUpdateClassMark(
//         user_id,
//         params,
//         sheet,
//         sheet_service,
//         level_service,
//         query_runner,
//         req,
//       );
//       if (result instanceof HttpException) throw result;
//       //#endregion

//       let success: EvaluationEntity[] | HttpException | null = null;
//       //#region Update Mark
//       success = await updateMarkClass(
//         user_id,
//         params,
//         evaluation_service,
//         form_service,
//         query_runner,
//         req,
//       );

//       if (success instanceof HttpException) throw success;
//       //#endregion

//       return await generateUpdateSuccessResponse(
//         sheet,
//         class_service,
//         department_service,
//         k_service,
//         user_service,
//         query_runner,
//         req,
//       );
//     } catch (err) {
//       // Rollback transaction
//       await query_runner.rollbackTransaction();

//       console.log('--------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) return err;
//       else {
//         //#region throw HandlerException
//         return new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//         //#endregion
//       }
//     } finally {
//       // Release transaction
//       await query_runner.release();
//     }
//   } else {
//     //#region throw HandlerException
//     return new UnknownException(
//       sheet_id,
//       DATABASE_EXIT_CODE.UNKNOW_VALUE,
//       req.method,
//       req.url,
//       sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
//     );
//     //#endregion
//   }
// };

// export const updateEvaluationDepartment = async (
//   sheet_id: number,
//   role: number,
//   user_id: string,
//   params: UpdateMarkDepartment,
//   approval_service: ApprovalService,
//   sheet_service: SheetService,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
//   level_service: LevelService,
//   department_service: DepartmentService,
//   class_service: ClassService,
//   k_service: KService,
//   user_service: UserService,
//   data_source: DataSource,
//   req: Request,
// ): Promise<HttpResponse<SheetDetailResponse> | HttpException> => {
//   //#region Get params
//   const { role_id } = params;
//   //#endregion

//   //#region Validation
//   //#region Validate role
//   const vali_role = validateRole(role_id, role, req);
//   if (vali_role instanceof HttpException) throw vali_role;
//   //#endregion

//   //#region Validate approval
//   const vali_approval = await validateApprovalTime(
//     sheet_id,
//     role,
//     approval_service,
//     req,
//   );
//   if (vali_approval instanceof HttpException) throw vali_approval;
//   //#endregion
//   //#endregion

//   const sheet = await sheet_service.getSheetById(sheet_id);
//   if (sheet) {
//     // Make the QueryRunner
//     const query_runner = data_source.createQueryRunner();

//     // Establish real database connection
//     await query_runner.connect();

//     try {
//       // Start transaction
//       await query_runner.startTransaction();

//       //#region Update sheet
//       const result = await generateUpdateDepartmentMark(
//         user_id,
//         params,
//         sheet,
//         sheet_service,
//         level_service,
//         query_runner,
//         req,
//       );
//       if (result instanceof HttpException) throw result;
//       //#endregion

//       let success: EvaluationEntity[] | HttpException | null = null;
//       //#region Update Mark
//       success = await updateMarkDepartment(
//         user_id,
//         params,
//         evaluation_service,
//         form_service,
//         query_runner,
//         req,
//       );

//       if (success instanceof HttpException) throw success;
//       //#endregion

//       return await generateUpdateSuccessResponse(
//         sheet,
//         class_service,
//         department_service,
//         k_service,
//         user_service,
//         query_runner,
//         req,
//       );
//     } catch (err) {
//       // Rollback transaction
//       await query_runner.rollbackTransaction();

//       console.log('--------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) return err;
//       else {
//         //#region throw HandlerException
//         return new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//         //#endregion
//       }
//     } finally {
//       // Release transaction
//       await query_runner.release();
//     }
//   } else {
//     //#region throw HandlerException
//     return new UnknownException(
//       sheet_id,
//       DATABASE_EXIT_CODE.UNKNOW_VALUE,
//       req.method,
//       req.url,
//       sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
//     );
//     //#endregion
//   }
// };

export const updateEvaluationItemStudent = async (
  sheet_id: number,
  user_id: string,
  params: UpdateMarkStudent,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  form_service: FormService,
  query_runner: QueryRunner,
  req: Request,
) => {
  return 1;
};

// export const updateMarkClass = async (
//   user_id: string,
//   params: UpdateMarkClass,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
//   query_runner: QueryRunner,
//   req: Request,
// ) => {
//   let evaluations: EvaluationEntity[] = [];

//   const { data } = params;

//   //#region loop of data
//   for await (const item of data) {
//     const form = await form_service.getFormById(item.form_id);
//     if (form) {
//       //#region Validation personal mark
//       const valid_personal_mark = validateMark(
//         item.personal_mark_level,
//         form.from_mark,
//         form.to_mark,
//         req,
//       );
//       if (valid_personal_mark instanceof HttpException)
//         return valid_personal_mark;
//       //#endregion

//       //#region Validation class mark
//       const valid_class_mark = validateMark(
//         item.class_mark_level,
//         form.from_mark,
//         form.to_mark,
//         req,
//       );
//       if (valid_class_mark instanceof HttpException) return valid_class_mark;
//       //#endregion

//       //#region update mark
//       const evaluation = await evaluation_service.getEvaluationById(
//         item.evaluation_id,
//       );

//       if (evaluation) {
//         evaluation.personal_mark_level = item.personal_mark_level;
//         evaluation.class_mark_level = item.class_mark_level;
//         evaluation.updated_at = new Date();
//         evaluation.updated_by = user_id;

//         evaluations.push(evaluation);
//       } else {
//         //#region throw HandlerException
//         return new UnknownException(
//           item.evaluation_id,
//           DATABASE_EXIT_CODE.UNKNOW_VALUE,
//           req.method,
//           req.url,
//           sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, item.evaluation_id),
//         );
//         //#endregion
//       }
//       //#endregion
//     } else {
//       //#region throw HandlerException
//       return new UnknownException(
//         item.form_id,
//         DATABASE_EXIT_CODE.UNKNOW_VALUE,
//         req.method,
//         req.url,
//         sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, item.form_id),
//       );
//     }
//   }
//   //#endregion

//   //#region Update evaluation
//   evaluations = await query_runner.manager.save(evaluations);
//   //#endregion

//   return evaluations;
// };

// export const updateMarkDepartment = async (
//   user_id: string,
//   params: UpdateMarkDepartment,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
//   query_runner: QueryRunner,
//   req: Request,
// ) => {
//   let evaluations: EvaluationEntity[] = [];

//   const { data } = params;

//   //#region loop of data
//   for await (const item of data) {
//     const form = await form_service.getFormById(item.form_id);
//     if (form) {
//       //#region Validation personal mark
//       const valid_personal_mark = validateMark(
//         item.personal_mark_level,
//         form.from_mark,
//         form.to_mark,
//         req,
//       );
//       if (valid_personal_mark instanceof HttpException)
//         return valid_personal_mark;
//       //#endregion

//       //#region Validation class mark
//       const valid_class_mark = validateMark(
//         item.class_mark_level,
//         form.from_mark,
//         form.to_mark,
//         req,
//       );
//       if (valid_class_mark instanceof HttpException) return valid_class_mark;
//       //#endregion

//       //#region Validation department mark
//       const valid_department_mark = validateMark(
//         item.class_mark_level,
//         form.from_mark,
//         form.to_mark,
//         req,
//       );
//       if (valid_department_mark instanceof HttpException)
//         return valid_department_mark;
//       //#endregion

//       //#region update mark
//       const evaluation = await evaluation_service.getEvaluationById(
//         item.evaluation_id,
//       );

//       if (evaluation) {
//         evaluation.personal_mark_level = item.personal_mark_level;
//         evaluation.class_mark_level = item.class_mark_level;
//         evaluation.department_mark_level = item.department_mark_level;
//         evaluation.updated_at = new Date();
//         evaluation.updated_by = user_id;

//         evaluations.push(evaluation);
//       } else {
//         //#region throw HandlerException
//         return new UnknownException(
//           item.evaluation_id,
//           DATABASE_EXIT_CODE.UNKNOW_VALUE,
//           req.method,
//           req.url,
//           sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, item.evaluation_id),
//         );
//         //#endregion
//       }
//       //#endregion
//     } else {
//       //#region throw HandlerException
//       return new UnknownException(
//         item.form_id,
//         DATABASE_EXIT_CODE.UNKNOW_VALUE,
//         req.method,
//         req.url,
//         sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, item.form_id),
//       );
//     }
//   }
//   //#endregion

//   //#region Update evaluation
//   evaluations = await query_runner.manager.save(evaluations);
//   //#endregion

//   return evaluations;
// };

export const generateUpdatePersonalMark = async (
  user_id: string,
  params: UpdateMarkStudent,
  sheet: SheetEntity,
  sheet_service: SheetService,
  level_service: LevelService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;

  let sum_of_personal_marks = 0;
  for (const item of data) {
    sum_of_personal_marks += item.personal_mark_level;
  }

  //#region Validate mark
  const level = await validateMarkLevel(
    sum_of_personal_marks,
    level_service,
    req,
  );
  if (level instanceof HttpException) throw level;
  //#endregion

  sheet.sum_of_personal_marks = sum_of_personal_marks;
  sheet.status = StatusSheet.WAITING_CLAS;
  sheet.level = level;
  sheet.updated_at = new Date();
  sheet.updated_by = user_id;

  sheet = await sheet_service.update(sheet, query_runner.manager);

  return sheet;
};

// export const generateUpdateClassMark = async (
//   user_id: string,
//   params: UpdateMarkClass,
//   sheet: SheetEntity,
//   sheet_service: SheetService,
//   level_service: LevelService,
//   query_runner: QueryRunner,
//   req: Request,
// ) => {
//   const { data } = params;

//   let sum_of_personal_marks = 0,
//     sum_of_class_marks = 0;

//   for (const item of data) {
//     sum_of_class_marks += item.class_mark_level;
//     sum_of_personal_marks += item.personal_mark_level;
//   }

//   //#region Validation mark
//   //#region Validate personal mark
//   let level = await validateMarkLevel(
//     sum_of_personal_marks,
//     level_service,
//     req,
//   );
//   if (level instanceof HttpException) throw level;
//   //#endregion

//   //#region Validate class mark
//   level = await validateMarkLevel(sum_of_class_marks, level_service, req);
//   if (level instanceof HttpException) throw level;
//   //#endregion
//   //#endregion

//   //#region Update sheet
//   sheet.sum_of_personal_marks = sum_of_personal_marks;
//   sheet.sum_of_class_marks = sum_of_class_marks;
//   sheet.status = StatusSheet.WAITING_DEPARTMENT;
//   sheet.level = level;
//   sheet.updated_at = new Date();
//   sheet.updated_by = user_id;

//   sheet = await sheet_service.update(sheet, query_runner.manager);

//   return sheet;
//   //#endregion
// };

// export const generateUpdateDepartmentMark = async (
//   user_id: string,
//   params: UpdateMarkDepartment,
//   sheet: SheetEntity,
//   sheet_service: SheetService,
//   level_service: LevelService,
//   query_runner: QueryRunner,
//   req: Request,
// ) => {
//   const { data } = params;

//   let sum_of_personal_marks = 0,
//     sum_of_class_marks = 0,
//     sum_of_department_marks = 0;

//   for (const item of data) {
//     sum_of_class_marks += item.class_mark_level;
//     sum_of_personal_marks += item.personal_mark_level;
//     sum_of_department_marks += item.department_mark_level;
//   }

//   //#region Validation mark
//   //#region Validate personal mark
//   let level = await validateMarkLevel(
//     sum_of_personal_marks,
//     level_service,
//     req,
//   );
//   if (level instanceof HttpException) throw level;
//   //#endregion

//   //#region Validate class mark
//   level = await validateMarkLevel(sum_of_class_marks, level_service, req);
//   if (level instanceof HttpException) throw level;
//   //#endregion

//   //#region Validate department mark
//   level = await validateMarkLevel(sum_of_department_marks, level_service, req);
//   if (level instanceof HttpException) throw level;
//   //#endregion
//   //#endregion

//   //#region Update sheet
//   sheet.sum_of_personal_marks = sum_of_personal_marks;
//   sheet.sum_of_class_marks = sum_of_class_marks;
//   sheet.sum_of_department_marks = sum_of_department_marks;
//   sheet.status = StatusSheet.SUCCESS;
//   sheet.level = level;
//   sheet.updated_at = new Date();
//   sheet.updated_by = user_id;

//   sheet = await sheet_service.update(sheet, query_runner.manager);

//   return sheet;
//   //#endregion
// };
