import { HttpException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Request } from 'express';

import { sprintf } from '../../../utils';
import {
  generateFailedResponse,
  generateSuccessResponse,
  groupItemsByHeader,
} from '../utils';
import { validateMark, validateSheet, validateTime } from '../validations';

import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import {
  ClassMarkDtos,
  UpdateClassMarkDto,
} from '../dtos/update_class_mark.dto';

import {
  UpdateDepartmentMarkDto,
  DepartmentMarkDtos,
} from '../dtos/update_department_mark.dto';

import {
  StudentMarkDtos,
  UpdateStudentMarkDto,
} from '../dtos/update_student_mark.dto';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { ItemService } from '../../item/services/item.service';
import { KService } from '../../k/services/k.service';
import { HeaderService } from '../../header/services/header.service';
import { LevelService } from '../../level/services/level.service';
import { OptionService } from '../../option/services/option.service';
import { SheetService } from '../services/sheet.service';
import { UserService } from '../../user/services/user.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { SheetDetailsResponse } from '../interfaces/sheet_response.interface';

import { SheetCategory } from '../constants/enums/categories.enum';
import { SheetStatus } from '../constants/enums/status.enum';
import { GROUP_KEY } from '../constants';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { OptionEntity } from 'src/entities/option.entity';

export const generatePersonalMarks = async (
  sheet_id: number,
  user_id: string,
  params: UpdateStudentMarkDto,
  class_service: ClassService,
  department_service: DepartmentService,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  k_service: KService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Get params
  const { role_id } = params;
  //#endregion

  //#region Validation
  //#region Validate sheet
  let sheet = await validateSheet(sheet_id, sheet_service, req);
  if (sheet instanceof HttpException) return sheet;
  //#endregion

  //#region Validate evaluate time
  const valid = await validateTime(sheet.form, role_id, req);
  if (valid instanceof HttpException) throw valid;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Update sheet
    sheet = await generateUpdateSheet(
      user_id,
      SheetCategory.STUDENT,
      SheetStatus.WAITING_CLASS,
      params,
      sheet,
      header_service,
      level_service,
      sheet_service,
      query_runner,
      req,
    );
    //#endregion

    if (sheet instanceof HttpException) throw sheet;
    else if (sheet) {
      //#region Update student evaluation
      const evaluations = await generateUpdateStudentEvaluation(
        sheet_id,
        user_id,
        params,
        sheet,
        evaluation_service,
        header_service,
        item_service,
        option_service,
        query_runner,
        req,
      );

      //#region throw HandlerException
      if (evaluations instanceof HttpException) throw evaluations;
      else if (evaluations) sheet.evaluations = evaluations;
      else {
        throw generateFailedResponse(
          req,
          ErrorMessage.OPERATOR_EVALUATION_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Update sheet relation
      // sheet = await query_runner.manager.save(sheet);
      // if (!sheet) {
      //   //#region throw HandlerException
      //   throw new HandlerException(
      //     DATABASE_EXIT_CODE.OPERATOR_ERROR,
      //     req.method,
      //     req.url,
      //     ErrorMessage.OPERATOR_SHEET_ERROR,
      //     HttpStatus.EXPECTATION_FAILED,
      //   );
      //   //#endregion
      // }
      //#endregion

      //#region Generate response
      return await generateSuccessResponse(
        sheet,
        class_service,
        department_service,
        k_service,
        user_service,
        query_runner,
        req,
      );
      //#endregion
    } else {
      //#region throw HandlerException
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_SHEET_ERROR);
      //#endregion
    }
  } catch (err) {
    console.log(err);
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
};

export const generateClassMarks = async (
  sheet_id: number,
  user_id: string,
  params: UpdateClassMarkDto,
  class_service: ClassService,
  department_service: DepartmentService,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  k_service: KService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Get params
  const { role_id, graded } = params;
  //#endregion

  //#region Validation
  //#region Validate sheet
  let sheet = await validateSheet(sheet_id, sheet_service, req);
  if (sheet instanceof HttpException) return sheet;
  //#endregion

  //#region Validate evaluate time
  const valid = await validateTime(sheet.form, role_id, req);
  if (valid instanceof HttpException) throw valid;
  //#endregion
  //#endregion

  if (!graded) {
    //#region Update not approval sheet
    const result = await sheet_service.unapproved(sheet_id, user_id);

    if (result) {
      //#region Generate response
      return await generateSuccessResponse(
        sheet,
        class_service,
        department_service,
        k_service,
        user_service,
        null,
        req,
      );
      //#endregion
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_EVALUATION_ERROR);
    }
    //#endregion
  } else {
    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();
    await query_runner.connect();

    try {
      // Start transaction
      await query_runner.startTransaction();

      //#region Update sheet
      sheet = await generateUpdateSheet(
        user_id,
        SheetCategory.CLASS,
        SheetStatus.WAITING_DEPARTMENT,
        params,
        sheet,
        header_service,
        level_service,
        sheet_service,
        query_runner,
        req,
      );
      //#endregion

      if (sheet instanceof HttpException) throw sheet;
      else if (sheet) {
        //#region Update class evaluation
        const evaluations = await generateUpdateClassEvaluation(
          sheet_id,
          user_id,
          params,
          sheet,
          evaluation_service,
          header_service,
          item_service,
          option_service,
          query_runner,
          req,
        );

        //#region throw HandlerException
        if (evaluations instanceof HttpException) throw evaluations;
        else if (evaluations) sheet.evaluations = evaluations;
        else {
          throw generateFailedResponse(
            req,
            ErrorMessage.OPERATOR_EVALUATION_ERROR,
          );
        }
        //#endregion
        //#endregion

        //#region Update sheet relation
        // sheet = await query_runner.manager.save(sheet);
        // if (!sheet) {
        //   //#region throw HandlerException
        //   throw new HandlerException(
        //     DATABASE_EXIT_CODE.OPERATOR_ERROR,
        //     req.method,
        //     req.url,
        //     ErrorMessage.OPERATOR_SHEET_ERROR,
        //     HttpStatus.EXPECTATION_FAILED,
        //   );
        //   //#endregion
        // }
        //#endregion

        //#region Generate response
        return await generateSuccessResponse(
          sheet,
          class_service,
          department_service,
          k_service,
          user_service,
          query_runner,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_SHEET_ERROR);
        //#endregion
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
  }
};

export const generateDepartmentMarks = async (
  sheet_id: number,
  user_id: string,
  params: UpdateDepartmentMarkDto,
  class_service: ClassService,
  department_service: DepartmentService,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  k_service: KService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Get params
  const { role_id, graded } = params;
  //#endregion

  //#region Validation
  //#region Validate sheet
  let sheet = await validateSheet(sheet_id, sheet_service, req);
  if (sheet instanceof HttpException) return sheet;
  //#endregion

  //#region Validate evaluate time
  const valid = await validateTime(sheet.form, role_id, req);
  if (valid instanceof HttpException) throw valid;
  //#endregion
  //#endregion

  if (!graded) {
    //#region Update not approval sheet
    const result = await sheet_service.unapproved(sheet_id, user_id);

    if (result) {
      //#region Generate response
      return await generateSuccessResponse(
        sheet,
        class_service,
        department_service,
        k_service,
        user_service,
        null,
        req,
      );
      //#endregion
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_EVALUATION_ERROR);
    }
    //#endregion
  } else {
    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();
    await query_runner.connect();

    try {
      // Start transaction
      await query_runner.startTransaction();

      //#region Update sheet
      sheet = await generateUpdateSheet(
        user_id,
        SheetCategory.DEPARTMENT,
        SheetStatus.SUCCESS,
        params,
        sheet,
        header_service,
        level_service,
        sheet_service,
        query_runner,
        req,
      );
      //#endregion

      if (sheet instanceof HttpException) throw sheet;
      else if (sheet) {
        //#region Update department evaluation
        const evaluations = await generateUpdateDepartmentEvaluation(
          sheet_id,
          user_id,
          params,
          sheet,
          evaluation_service,
          header_service,
          item_service,
          option_service,
          query_runner,
          req,
        );

        //#region throw HandlerException
        if (evaluations instanceof HttpException) throw evaluations;
        else if (evaluations) sheet.evaluations = evaluations;
        else {
          throw generateFailedResponse(
            req,
            ErrorMessage.OPERATOR_EVALUATION_ERROR,
          );
        }
        //#endregion
        //#endregion

        //#region Update sheet relation
        // sheet = await query_runner.manager.save(sheet);
        // if (!sheet) {
        //   //#region throw HandlerException
        //   throw new HandlerException(
        //     DATABASE_EXIT_CODE.OPERATOR_ERROR,
        //     req.method,
        //     req.url,
        //     ErrorMessage.OPERATOR_SHEET_ERROR,
        //     HttpStatus.EXPECTATION_FAILED,
        //   );
        //   //#endregion
        // }
        //#endregion

        //#region Generate response
        return await generateSuccessResponse(
          sheet,
          class_service,
          department_service,
          k_service,
          user_service,
          query_runner,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_SHEET_ERROR);
        //#endregion
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
  }
};

export const generateUpdateStudentEvaluation = async (
  sheet_id: number,
  user_id: string,
  params: UpdateStudentMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
): Promise<EvaluationEntity[] | HttpException> => {
  let evaluations: EvaluationEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  for await (const item of arr_items) {
    //#region Validate Header
    const header = await header_service.getHeaderById(item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = await item_service.getItemById(j.item_id);
        if (item) {
          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = await option_service.getOptionById(j.option_id ?? 0);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(
            j.personal_mark_level,
            item.from_mark,
            item.to_mark,
            req,
          );

          if (valid instanceof HttpException) return valid;
          //#endregion

          const evaluation = await evaluation_service.contains(
            sheet_id,
            j.item_id,
          );
          if (evaluation) {
            if (j.deleted) {
              //#region Check deleted
              evaluation.deleted = true;
              evaluation.deleted_at = new Date();
              evaluation.deleted_by = user_id;

              evaluations.push(evaluation);
              //#endregion
            } else {
              //#region Update evaluation
              evaluation.sheet = sheet;
              evaluation.item = item;
              evaluation.option = option ?? null;
              evaluation.personal_mark_level = j.personal_mark_level;
              evaluation.updated_at = new Date();
              evaluation.updated_by = user_id;
              evaluations.push(evaluation);
              //#endregion
            }
          } else {
            //#region Create evaluation
            const evaluation = new EvaluationEntity();
            evaluation.sheet = sheet;
            evaluation.item = item;
            evaluation.option = option;
            evaluation.personal_mark_level = j.personal_mark_level;
            evaluation.created_at = new Date();
            evaluation.created_by = user_id;
            evaluations.push(evaluation);
            //#endregion
          }
        } else {
          //#region throw HandlerException
          return new UnknownException(
            j.item_id,
            DATABASE_EXIT_CODE.UNKNOW_VALUE,
            req.method,
            req.url,
            sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, j.item_id),
          );
          //#endregion
        }
      }
    } else {
      //#region throw HandlerException
      return new UnknownException(
        item[0].header_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, item[0].header_id),
      );
      //#endregion
    }
    //#endregion
  }

  //#region Update evaluation
  evaluations = await query_runner.manager.save(evaluations);
  //#endregion
  return evaluations;
};

export const generateUpdateClassEvaluation = async (
  sheet_id: number,
  user_id: string,
  params: UpdateClassMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
) => {
  let evaluations: EvaluationEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  for await (const item of arr_items) {
    //#region Validate Header
    const header = await header_service.getHeaderById(item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = await item_service.getItemById(j.item_id);
        if (item) {
          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = await option_service.getOptionById(j.option_id ?? 0);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(
            j.class_mark_level,
            item.from_mark,
            item.to_mark,
            req,
          );

          if (valid instanceof HttpException) return valid;
          //#endregion

          const evaluation = await evaluation_service.contains(
            sheet_id,
            j.item_id,
          );
          if (evaluation) {
            if (j.deleted && option) {
              //#region Check deleted
              evaluation.deleted = true;
              evaluation.deleted_at = new Date();
              evaluation.deleted_by = user_id;

              evaluations.push(evaluation);
              //#endregion
            } else {
              //#region Update evaluation
              evaluation.sheet = sheet;
              evaluation.item = item;
              evaluation.option = option ?? null;
              evaluation.class_mark_level = j.class_mark_level;
              evaluation.updated_at = new Date();
              evaluation.updated_by = user_id;
              evaluations.push(evaluation);
              //#endregion
            }
          } else {
            //#region Create evaluation
            const evaluation = new EvaluationEntity();
            evaluation.sheet = sheet;
            evaluation.item = item;
            evaluation.option = option;
            evaluation.class_mark_level = j.class_mark_level;
            evaluation.created_at = new Date();
            evaluation.created_by = user_id;
            evaluations.push(evaluation);
            //#endregion
          }
        } else {
          //#region throw HandlerException
          return new UnknownException(
            j.item_id,
            DATABASE_EXIT_CODE.UNKNOW_VALUE,
            req.method,
            req.url,
            sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, j.item_id),
          );
          //#endregion
        }
      }
    } else {
      //#region throw HandlerException
      return new UnknownException(
        item[0].header_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, item[0].header_id),
      );
      //#endregion
    }
    //#endregion
  }

  //#region Update evaluation
  evaluations = await query_runner.manager.save(evaluations);
  //#endregion

  return evaluations;
};

export const generateUpdateDepartmentEvaluation = async (
  sheet_id: number,
  user_id: string,
  params: UpdateDepartmentMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
) => {
  let evaluations: EvaluationEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  for await (const item of arr_items) {
    //#region Validate Header
    const header = await header_service.getHeaderById(item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = await item_service.getItemById(j.item_id);
        if (item) {
          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = await option_service.getOptionById(j.option_id ?? 0);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(
            j.department_mark_level,
            item.from_mark,
            item.to_mark,
            req,
          );

          if (valid instanceof HttpException) return valid;
          //#endregion

          const evaluation = await evaluation_service.contains(
            sheet_id,
            j.item_id,
          );
          if (evaluation) {
            if (j.deleted) {
              //#region Check deleted
              evaluation.deleted = true;
              evaluation.deleted_at = new Date();
              evaluation.deleted_by = user_id;

              evaluations.push(evaluation);
              //#endregion
            } else {
              //#region Update evaluation
              evaluation.sheet = sheet;
              evaluation.item = item;
              evaluation.option = option ?? null;
              evaluation.department_mark_level = j.department_mark_level;
              evaluation.updated_at = new Date();
              evaluation.updated_by = user_id;
              evaluations.push(evaluation);
              //#endregion
            }
          } else {
            //#region Create evaluation
            const evaluation = new EvaluationEntity();
            evaluation.sheet = sheet;
            evaluation.item = item;
            evaluation.option = option;
            evaluation.department_mark_level = j.department_mark_level;
            evaluation.created_at = new Date();
            evaluation.created_by = user_id;
            evaluations.push(evaluation);
            //#endregion
          }
        } else {
          //#region throw HandlerException
          return new UnknownException(
            j.item_id,
            DATABASE_EXIT_CODE.UNKNOW_VALUE,
            req.method,
            req.url,
            sprintf(ErrorMessage.EVALUATION_NOT_FOUND_ERROR, j.item_id),
          );
          //#endregion
        }
      }
    } else {
      //#region throw HandlerException
      return new UnknownException(
        item[0].header_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, item[0].header_id),
      );
      //#endregion
    }
    //#endregion
  }

  //#region Update evaluation
  evaluations = await query_runner.manager.save(evaluations);
  //#endregion

  return evaluations;
};

export const generateUpdateSheet = async (
  user_id: string,
  category: SheetCategory,
  status: SheetStatus,
  params: UpdateStudentMarkDto | UpdateClassMarkDto | UpdateDepartmentMarkDto,
  sheet: SheetEntity,
  header_service: HeaderService,
  level_service: LevelService,
  sheet_service: SheetService,
  query_runner: QueryRunner,
  req: Request,
): Promise<SheetEntity | HttpException> => {
  //#region Get params
  const { data } = params;
  let arr_items;
  if (data instanceof StudentMarkDtos) {
    arr_items = groupItemsByHeader(data as StudentMarkDtos[], GROUP_KEY);
  } else if (data instanceof ClassMarkDtos) {
    arr_items = groupItemsByHeader(data as ClassMarkDtos[], GROUP_KEY);
  } else {
    arr_items = groupItemsByHeader(data as DepartmentMarkDtos[], GROUP_KEY);
  }
  //#endregion

  //#region Calculate sum of marks
  let sum_of_marks = 0;
  for (const item of arr_items) {
    const header = await header_service.getHeaderById(item[0]);
    if (header) {
      let sum_of_mark_items = 0;
      for (const j of item[1]) {
        if (!j.deleted) {
          if (j instanceof StudentMarkDtos) {
            sum_of_mark_items += j.personal_mark_level;
          } else if (j instanceof ClassMarkDtos) {
            sum_of_mark_items += j.class_mark_level;
          } else sum_of_mark_items += j.department_mark_level;
        }
      }

      sum_of_mark_items =
        header.max_mark > sum_of_mark_items
          ? sum_of_mark_items
          : header.max_mark;

      sum_of_marks += sum_of_mark_items;
    } else {
      //#region throw HandlerException
      return new UnknownException(
        item[0],
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, item[0]),
      );
      //#endregion
    }
  }

  //#endregion
  //#region Get level in mark range
  const level = await getLevel(sum_of_marks, level_service, req);
  if (level instanceof HttpException) return level;
  //#endregion

  if (category === SheetCategory.STUDENT)
    sheet.sum_of_personal_marks = sum_of_marks;
  else if (category === SheetCategory.CLASS)
    sheet.sum_of_class_marks = sum_of_marks;
  else sheet.sum_of_department_marks = sum_of_marks;

  sheet.status = status;
  sheet.level = level;
  sheet.updated_at = new Date();
  sheet.updated_by = user_id;

  sheet = await sheet_service.update(sheet, query_runner.manager);
  return sheet;
};

export const getLevel = async (
  mark: number,
  level_service: LevelService,
  req: Request,
) => {
  const level = await level_service.getLevelByMark(mark);
  if (!level) {
    //#region throw HandleException
    return new UnknownException(
      mark,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.LEVEL_NOT_FOUND_ERROR, mark),
    );
    //#endregion
  }

  return level;
};
