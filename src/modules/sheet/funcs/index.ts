import { HttpException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Request } from 'express';

import { sprintf } from 'src/utils';
import { generateStudentUpdateSuccessResponse } from '../utils';

import { SheetEntity } from '../../../entities/sheet.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';

import { UnknownException } from '../../../exceptions/UnknownException';
import { HandlerException } from 'src/exceptions/HandlerException';

import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { FormService } from '../../form/services/form.service';
import { LevelService } from 'src/modules/level/services/level.service';
import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { SheetService } from '../services/sheet.service';

import { UpdateMarkStudent } from '../dtos/update_mark_student.dto';

import { HttpResponse } from 'src/interfaces/http-response.interface';
import { SheetDetailResponse } from '../interfaces/sheet_response.interface';

import { validateRole } from '../validations';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from 'src/constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/errors.enum';
export const updateEvaluation = async (
  sheet_id: number,
  role: number,
  params: UpdateMarkStudent,
  sheet_service: SheetService,
  evaluation_service: EvaluationService,
  form_service: FormService,
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
  //#region Validation role
  const vali_role = validateRole(role_id, role, req);
  if (vali_role instanceof HttpException) throw vali_role;
  //#endregion
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

      //#region Update sheet
      const result = await generateUpdatePersonalMark(
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
        success = await updateMarkForStudent(
          params,
          sheet,
          evaluation_service,
          form_service,
          query_runner,
          req,
        );
        //#endregion

        if (success instanceof HttpException) throw success;

        return await generateStudentUpdateSuccessResponse(
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

export const updateMarkForStudent = async (
  params: UpdateMarkStudent,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  form_service: FormService,
  query_runner: QueryRunner,
  req: Request,
) => {
  let evaluations: EvaluationEntity[] = [];

  const { data } = params;
  //#region loop of data
  for await (const item of data) {
    if (item.evaluation_id) {
      //#region Update evaluation
      const evaluation = await evaluation_service.getEvaluationById(
        item.evaluation_id,
      );

      if (evaluation) {
        evaluation.personal_mark_level = item.personal_mark_level;
        evaluation.updated_at = new Date();
        evaluation.updated_by = 'system';

        evaluations.push(evaluation);
      } else {
        //#region throw HandlerException
        return new UnknownException(
          item.evaluation_id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, item.evaluation_id),
        );
        //#endregion
      }
      //#endregion
    } else {
      //#region Add evaluation
      const form = await form_service.getFormById(item.form_id);

      if (form) {
        const evaluation = new EvaluationEntity();
        evaluation.ref = form.ref;
        evaluation.parent_id = form.parent_id;
        evaluation.form = form;
        evaluation.sheet = sheet;
        evaluation.personal_mark_level = item.personal_mark_level;
        evaluation.created_at = new Date();
        evaluation.created_by = 'system';

        evaluations.push(evaluation);
      } else {
        //#region throw HandlerException
        return new UnknownException(
          item.evaluation_id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, item.evaluation_id),
        );
        //#endregion
      }
      //#endregion
    }
  }
  //#endregion

  //#region Update evaluation
  evaluations = await query_runner.manager.save(evaluations);
  //#endregion

  return evaluations;
};

export const generateUpdatePersonalMark = async (
  params: UpdateMarkStudent,
  sheet: SheetEntity,
  sheet_service: SheetService,
  level_service: LevelService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const { data } = params;

  let sum = 0;
  for (const item of data) {
    sum += item.personal_mark_level;
  }

  const level = await level_service.getLevelByMark(sum);

  if (!level) {
    //#region throw HandleException
    return new UnknownException(
      sum,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.MARK_NOT_FOUND_ERROR, sum),
    );
    //#endregion
  }

  sheet.sum_of_personal_marks = sum;
  sheet.level = level;
  sheet.updated_at = new Date();
  sheet.updated_by = 'system';

  sheet = await sheet_service.update(sheet, query_runner.manager);

  return sheet;
};
