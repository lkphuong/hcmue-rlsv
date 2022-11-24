import { HttpException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Request } from 'express';

import { sprintf } from 'src/utils';
import { generateUpdateSuccessResponse } from '../utils';

import { SheetEntity } from '../../../entities/sheet.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';

import { UnknownException } from '../../../exceptions/UnknownException';
import { HandlerException } from 'src/exceptions/HandlerException';

import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { LevelService } from '../../level/services/level.service';
import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { SheetService } from '../services/sheet.service';
import { ItemService } from '../../item/services/item.service';
import { OptionService } from '../../option/services/option.service';

import { DepartmentUpdateMarkDto } from '../dtos/update_mark_department.dto';
import { StudentUpdateMarkDto } from '../dtos/update_mark_student.dto';
import { ClassUpdateMarkDto } from '../dtos/update_mark_class.dto';

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

export const updateEvaluationPersonal = async (
  sheet_id: number,
  role: number,
  user_id: string,
  params: StudentUpdateMarkDto,
  sheet_service: SheetService,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  level_service: LevelService,
  department_service: DepartmentService,
  class_service: ClassService,
  k_service: KService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailResponse> | HttpException> => {
  //#region
  const { role_id } = params;
  //#endregion

  //#region Validation

  //#region Validate role
  const vali_role = validateRole(role_id, role, req);
  if (vali_role instanceof HttpException) throw vali_role;
  //#endregion

  const sheet = await sheet_service.getSheetById(sheet_id);
  if (sheet) {
    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();

    // Establish real database connection
    await query_runner.connect();

    try {
      // Start transaction
      await query_runner.startTransaction();

      // //#region Validate approval
      const vali_approval = await validateApprovalTime(
        sheet.form,
        role_id,
        req,
      );
      if (vali_approval instanceof HttpException) throw vali_approval;
      // //#endregion

      //#region Update sheet
      const result = await generatePersonalUpdateMark(
        user_id,
        params,
        sheet,
        sheet_service,
        level_service,
        query_runner,
        req,
      );
      //#endregion

      if (result instanceof HttpException) throw result;

      if (result) {
        let success: EvaluationEntity[] | HttpException | null = null;

        //#region
        success = await studentUpdateMark(
          sheet_id,
          user_id,
          params,
          sheet,
          item_service,
          option_service,
          evaluation_service,
          query_runner,
          req,
        );
        //#endregion

        if (success instanceof HttpException) throw success;

        return await generateUpdateSuccessResponse(
          sheet,
          class_service,
          department_service,
          k_service,
          user_service,
          query_runner,
          req,
        );
      }
    } catch (err) {
      // Rollback transaction
      await query_runner.rollbackTransaction();

      console.log('--------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + err.message);

      if (err instanceof HttpException) return err;
      else {
        //#region throw HandlerException
        return new HandlerException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
        );
        //#endregion
      }
    } finally {
      // Release transaction
      await query_runner.release();
    }
  } else {
    //#region throw HandlerException
    return new UnknownException(
      sheet_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
    );
    //#endregion
  }
};

export const updateEvaluationClass = async (
  sheet_id: number,
  role: number,
  user_id: string,
  params: ClassUpdateMarkDto,
  sheet_service: SheetService,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  level_service: LevelService,
  department_service: DepartmentService,
  class_service: ClassService,
  k_service: KService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailResponse> | HttpException> => {
  //#region Get params
  const { role_id } = params;
  //#endregion

  //#region Validation
  //#region Validate role
  const vali_role = validateRole(role_id, role, req);
  if (vali_role instanceof HttpException) throw vali_role;
  //#endregion

  //#endregion

  const sheet = await sheet_service.getSheetById(sheet_id);
  if (sheet) {
    //#region Validate approval
    const vali_approval = await validateApprovalTime(sheet.form, role_id, req);
    if (vali_approval instanceof HttpException) throw vali_approval;
    //#endregion

    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();

    // Establish real database connection
    await query_runner.connect();

    try {
      // Start transaction
      await query_runner.startTransaction();

      //#region Update sheet
      const result = await generateClassUpdateMark(
        user_id,
        params,
        sheet,
        sheet_service,
        level_service,
        query_runner,
        req,
      );
      if (result instanceof HttpException) throw result;
      //#endregion

      let success: EvaluationEntity[] | HttpException | null = null;
      //#region Update Mark
      success = await classUpdateMark(
        sheet_id,
        user_id,
        params,
        sheet,
        item_service,
        option_service,
        evaluation_service,
        query_runner,
        req,
      );

      if (success instanceof HttpException) throw success;
      //#endregion

      return await generateUpdateSuccessResponse(
        sheet,
        class_service,
        department_service,
        k_service,
        user_service,
        query_runner,
        req,
      );
    } catch (err) {
      // Rollback transaction
      await query_runner.rollbackTransaction();

      console.log('--------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + err.message);

      if (err instanceof HttpException) return err;
      else {
        //#region throw HandlerException
        return new HandlerException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
        );
        //#endregion
      }
    } finally {
      // Release transaction
      await query_runner.release();
    }
  } else {
    //#region throw HandlerException
    return new UnknownException(
      sheet_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
    );
    //#endregion
  }
};

export const updateEvaluationDepartment = async (
  sheet_id: number,
  role: number,
  user_id: string,
  params: DepartmentUpdateMarkDto,
  sheet_service: SheetService,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  level_service: LevelService,
  department_service: DepartmentService,
  class_service: ClassService,
  k_service: KService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailResponse> | HttpException> => {
  //#region Get params
  const { role_id } = params;
  //#endregion

  //#region Validation
  //#region Validate role
  const vali_role = validateRole(role_id, role, req);
  if (vali_role instanceof HttpException) throw vali_role;
  //#endregion
  //#endregion

  const sheet = await sheet_service.getSheetById(sheet_id);
  if (sheet) {
    //#region Validate approval
    const vali_approval = await validateApprovalTime(sheet.form, role_id, req);
    if (vali_approval instanceof HttpException) throw vali_approval;
    //#endregion

    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();

    // Establish real database connection
    await query_runner.connect();

    try {
      // Start transaction
      await query_runner.startTransaction();

      //#region Update sheet
      const result = await generateUpdateDepartmentMark(
        user_id,
        params,
        sheet,
        sheet_service,
        level_service,
        query_runner,
        req,
      );
      if (result instanceof HttpException) throw result;
      //#endregion

      let success: EvaluationEntity[] | HttpException | null = null;
      //#region Update Mark
      success = await departmentUpdateMark(
        sheet_id,
        user_id,
        params,
        sheet,
        item_service,
        option_service,
        evaluation_service,
        query_runner,
        req,
      );

      if (success instanceof HttpException) throw success;
      //#endregion

      return await generateUpdateSuccessResponse(
        sheet,
        class_service,
        department_service,
        k_service,
        user_service,
        query_runner,
        req,
      );
    } catch (err) {
      // Rollback transaction
      await query_runner.rollbackTransaction();

      console.log('--------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + err.message);

      if (err instanceof HttpException) return err;
      else {
        //#region throw HandlerException
        return new HandlerException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
        );
        //#endregion
      }
    } finally {
      // Release transaction
      await query_runner.release();
    }
  } else {
    //#region throw HandlerException
    return new UnknownException(
      sheet_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
    );
    //#endregion
  }
};

export const studentUpdateMark = async (
  sheet_id: number,
  user_id: string,
  params: StudentUpdateMarkDto,
  sheet: SheetEntity,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;
  let add_evaluations: EvaluationEntity[] = [];

  for (const i of data) {
    const item = await item_service.getItemById(i.item_id);
    if (item) {
      let option: OptionEntity = null,
        valid_mark: HttpException | null = null;
      if (i.option_id) {
        option = await option_service.getOptionById(i.option_id);

        //#region Validate Mark
        //#region  Validate Mark Student
        valid_mark = validateMark(
          i.personal_mark_level,
          option.from_mark,
          option.to_mark,
          req,
        );

        if (valid_mark instanceof HttpException) return valid_mark;
        //#endregion
        //#endregion
      }

      //#region Validate Mark
      //#region  Validate Mark Student
      valid_mark = validateMark(
        i.personal_mark_level,
        item.from_mark,
        item.to_mark,
        req,
      );

      if (valid_mark instanceof HttpException) return valid_mark;
      //#endregion
      //#endregion

      const evaluation = await evaluation_service.contains(sheet_id, i.item_id);

      if (evaluation) {
        //#region Update evaluation
        evaluation.sheet = sheet;
        evaluation.item = item;
        evaluation.option = option ?? null;
        evaluation.personal_mark_level = i.personal_mark_level;
        evaluation.updated_at = new Date();
        evaluation.updated_by = user_id;

        add_evaluations.push(evaluation);
        //#endregion
      } else {
        //#region Create evaluation
        const evaluation = new EvaluationEntity();
        evaluation.sheet = sheet;
        evaluation.item = item;
        evaluation.option = option;
        evaluation.personal_mark_level = i.personal_mark_level;
        evaluation.created_at = new Date();
        evaluation.created_by = user_id;

        add_evaluations.push(evaluation);
        //#endregion
      }
    } else {
      //#region throw HandlerException
      return new UnknownException(
        i.item_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, i.item_id),
      );
      //#endregion
    }
  }

  //#region Update evaluation
  add_evaluations = await query_runner.manager.save(add_evaluations);
  //#endregion

  return add_evaluations;
};

export const classUpdateMark = async (
  sheet_id: number,
  user_id: string,
  params: ClassUpdateMarkDto,
  sheet: SheetEntity,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;
  let add_evaluations: EvaluationEntity[] = [];

  for (const i of data) {
    const item = await item_service.getItemById(i.item_id);
    if (item) {
      let option: OptionEntity = null,
        valid_mark: HttpException | null = null;
      if (i.option_id) {
        option = await option_service.getOptionById(i.option_id);

        //#region Validate Mark
        //#region Validate Mark Class
        valid_mark = validateMark(
          i.class_mark_level,
          option.from_mark,
          option.to_mark,
          req,
        );
        if (valid_mark instanceof HttpException) return valid_mark;
        //#endregion
        //#endregion
      }

      //#region Validate Mark
      //#region Validate Mark Class
      valid_mark = validateMark(
        i.class_mark_level,
        item.from_mark,
        item.to_mark,
        req,
      );
      if (valid_mark instanceof HttpException) return valid_mark;
      //#endregion
      //#endregion

      const evaluation = await evaluation_service.contains(sheet_id, i.item_id);

      if (evaluation) {
        //#region Update evaluation
        evaluation.sheet = sheet;
        evaluation.item = item;
        evaluation.option = option ?? null;
        evaluation.class_mark_level = i.class_mark_level;
        evaluation.updated_at = new Date();
        evaluation.updated_by = user_id;

        add_evaluations.push(evaluation);
        //#endregion
      } else {
        //#region Create evaluation
        const evaluation = new EvaluationEntity();
        evaluation.sheet = sheet;
        evaluation.item = item;
        evaluation.option = option;
        evaluation.class_mark_level = i.class_mark_level;
        evaluation.created_at = new Date();
        evaluation.created_by = user_id;

        add_evaluations.push(evaluation);
        //#endregion
      }
    } else {
      //#region throw HandlerException
      return new UnknownException(
        i.item_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, i.item_id),
      );
      //#endregion
    }
  }

  //#region Update evaluation
  add_evaluations = await query_runner.manager.save(add_evaluations);
  //#endregion

  return add_evaluations;
};

export const departmentUpdateMark = async (
  sheet_id: number,
  user_id: string,
  params: DepartmentUpdateMarkDto,
  sheet: SheetEntity,
  item_service: ItemService,
  option_service: OptionService,
  evaluation_service: EvaluationService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;
  let add_evaluations: EvaluationEntity[] = [];

  for (const i of data) {
    const item = await item_service.getItemById(i.item_id);
    if (item) {
      let option: OptionEntity = null,
        valid_mark: HttpException | null = null;
      if (i.option_id) {
        option = await option_service.getOptionById(i.option_id);

        //#region Validate Mark
        //#region Validate Mark Department
        valid_mark = validateMark(
          i.department_mark_level,
          option.from_mark,
          option.to_mark,
          req,
        );
        if (valid_mark instanceof HttpException) return valid_mark;
        //#endregion
        //#endregion
      }

      //#region Validate Mark
      //#region Validate Mark Department
      valid_mark = validateMark(
        i.department_mark_level,
        item.from_mark,
        item.to_mark,
        req,
      );
      if (valid_mark instanceof HttpException) return valid_mark;
      //#endregion
      //#endregion

      const evaluation = await evaluation_service.contains(sheet_id, i.item_id);

      if (evaluation) {
        //#region Update evaluation
        evaluation.sheet = sheet;
        evaluation.item = item;
        evaluation.option = option ?? null;
        evaluation.department_mark_level = i.department_mark_level;
        evaluation.updated_at = new Date();
        evaluation.updated_by = user_id;

        add_evaluations.push(evaluation);
        //#endregion
      } else {
        //#region Create evaluation
        const evaluation = new EvaluationEntity();
        evaluation.sheet = sheet;
        evaluation.item = item;
        evaluation.option = option;
        evaluation.department_mark_level = i.department_mark_level;
        evaluation.created_at = new Date();
        evaluation.created_by = user_id;

        add_evaluations.push(evaluation);
        //#endregion
      }
    } else {
      //#region throw HandlerException
      return new UnknownException(
        i.item_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, i.item_id),
      );
      //#endregion
    }
  }

  //#region Update evaluation
  add_evaluations = await query_runner.manager.save(add_evaluations);
  //#endregion

  return add_evaluations;
};
export const generatePersonalUpdateMark = async (
  user_id: string,
  params: StudentUpdateMarkDto,
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
  sheet.status = StatusSheet.WAITING_CLASS;
  sheet.level = level;
  sheet.updated_at = new Date();
  sheet.updated_by = user_id;

  sheet = await sheet_service.update(sheet, query_runner.manager);

  return sheet;
};

export const generateClassUpdateMark = async (
  user_id: string,
  params: ClassUpdateMarkDto,
  sheet: SheetEntity,
  sheet_service: SheetService,
  level_service: LevelService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;

  let sum_of_class_marks = 0;

  for (const item of data) {
    sum_of_class_marks += item.class_mark_level;
  }

  //#region Validation mark
  //#region Validate class mark
  const level = await validateMarkLevel(sum_of_class_marks, level_service, req);
  if (level instanceof HttpException) throw level;
  //#endregion
  //#endregion

  //#region Update sheet

  sheet.sum_of_class_marks = sum_of_class_marks;
  sheet.status = StatusSheet.WAITING_DEPARTMENT;
  sheet.level = level;
  sheet.updated_at = new Date();
  sheet.updated_by = user_id;

  sheet = await sheet_service.update(sheet, query_runner.manager);

  return sheet;
  //#endregion
};

export const generateUpdateDepartmentMark = async (
  user_id: string,
  params: DepartmentUpdateMarkDto,
  sheet: SheetEntity,
  sheet_service: SheetService,
  level_service: LevelService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;

  let sum_of_department_marks = 0;

  for (const item of data) {
    sum_of_department_marks += item.department_mark_level;
  }

  //#region Validation mark
  //#region Validate department mark
  const level = await validateMarkLevel(
    sum_of_department_marks,
    level_service,
    req,
  );
  if (level instanceof HttpException) throw level;
  //#endregion
  //#endregion

  //#region Update sheet
  sheet.sum_of_department_marks = sum_of_department_marks;
  sheet.status = StatusSheet.SUCCESS;
  sheet.level = level;
  sheet.updated_at = new Date();
  sheet.updated_by = user_id;

  sheet = await sheet_service.update(sheet, query_runner.manager);

  return sheet;
  //#endregion
};
