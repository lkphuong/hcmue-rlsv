import { HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Request } from 'express';
import { randomUUID } from 'crypto';

import { sprintf } from '../../../utils';
import {
  generateFailedResponse,
  generateFileIds,
  generateItemIds,
  generateOptionIds,
  generateSuccessResponse,
  groupItemsByHeader,
} from '../utils';
import {
  validateMark,
  validateUpdateEvaluationMaxFile,
  validateTime,
  validateCreateEvaluationMaxFile,
  validateRequiredOption,
  validateStatusApproval,
} from '../validations';

import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { FileEntity } from '../../../entities/file.entity';
import { LevelEntity } from '../../../entities/level.entity';
import { OptionEntity } from '../../../entities/option.entity';
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

import {
  AdviserMarkDtos,
  UpdateAdviserMarkDto,
} from '../dtos/update_adviser_mark.dto';

import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { ItemService } from '../../item/services/item.service';
import { FilesService } from '../../file/services/files.service';
import { HeaderService } from '../../header/services/header.service';
import { LevelService } from '../../level/services/level.service';
import { OptionService } from '../../option/services/option.service';
import { SheetService } from '../services/sheet.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { SheetDetailsResponse } from '../interfaces/sheet_response.interface';

import { SheetCategory } from '../constants/enums/categories.enum';
import { SheetStatus } from '../constants/enums/status.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { GROUP_KEY } from '../constants';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
  UNKNOW_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { EvaluationCategory } from '../constants/enums/evaluation_catogory.enum';
import { RoleCode } from '../../../constants/enums/role_enum';

export const generatePersonalMarks = async (
  request_code: string,
  role_id: number,
  params: UpdateStudentMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  file_service: FilesService,
  header_service: HeaderService,
  item_service: ItemService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Validation
  //#region Validate evaluate time
  let valid: HandlerException | null = null;
  if (role_id !== RoleCode.ADMIN) {
    valid = await validateTime(sheet.form, req);
    if (valid instanceof HttpException) throw valid;
  }
  //#endregion

  //#region Validate adviser approved
  valid = await validateStatusApproval(sheet, req);
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
    const result = await generateUpdateSheet(
      request_code,
      SheetCategory.STUDENT,
      SheetStatus.WAITING_CLASS,
      params,
      sheet,
      item_service,
      header_service,
      level_service,
      sheet_service,
      query_runner,
      req,
    );
    //#endregion

    if (result instanceof HttpException) throw result;
    else if (result) {
      //#region Update student evaluation
      const evaluations = await generateUpdateStudentEvaluation(
        result.id,
        request_code,
        params,
        result,
        evaluation_service,
        file_service,
        header_service,
        item_service,
        option_service,
        query_runner,
        req,
      );

      //#region throw HandlerException
      if (evaluations instanceof HttpException) throw evaluations;
      else if (evaluations) result.evaluations = evaluations;
      else {
        throw generateFailedResponse(
          req,
          ErrorMessage.OPERATOR_EVALUATION_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Generate response
      return await generateSuccessResponse(
        sheet,
        role_id,
        sheet_service,
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
    console.log('err: ', err);
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
  request_code: string,
  role_id: number,
  params: UpdateClassMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Validation
  //#region Validate evaluate time

  let valid: HandlerException | null = null;
  if (role_id !== RoleCode.ADMIN) {
    valid = await validateTime(sheet.form, req);
    if (valid instanceof HttpException) throw valid;
  }
  //#endregion

  //#region Validate adviser approved
  valid = await validateStatusApproval(sheet, req);
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
    const result = await generateUpdateSheet(
      request_code,
      SheetCategory.CLASS,
      SheetStatus.WAITING_ADVISER,
      params,
      sheet,
      item_service,
      header_service,
      level_service,
      sheet_service,
      query_runner,
      req,
    );
    //#endregion
    if (result instanceof HttpException) throw result;
    else if (result) {
      //#region Update class evaluation
      const evaluations = await generateUpdateClassEvaluation(
        result.id,
        request_code,
        params,
        result,
        evaluation_service,
        header_service,
        item_service,
        option_service,
        query_runner,
        req,
      );

      //#region throw HandlerException
      if (evaluations instanceof HttpException) throw evaluations;
      else if (evaluations) result.evaluations = evaluations;
      else {
        throw generateFailedResponse(
          req,
          ErrorMessage.OPERATOR_EVALUATION_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Generate response
      return await generateSuccessResponse(
        result,
        role_id,
        sheet_service,
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
};

export const generateAdviserMarks = async (
  request_code: string,
  role_id: number,
  params: UpdateAdviserMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Validation
  //#region Validate evaluate time
  let valid: HandlerException | null = null;
  if (role_id !== RoleCode.ADMIN) {
    valid = await validateTime(sheet.form, req);
    if (valid instanceof HttpException) throw valid;
  }
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Update sheet
    const result = await generateUpdateSheet(
      request_code,
      SheetCategory.ADVISER,
      SheetStatus.WAITING_DEPARTMENT,
      params,
      sheet,
      item_service,
      header_service,
      level_service,
      sheet_service,
      query_runner,
      req,
    );
    //#endregion
    if (result instanceof HttpException) throw result;
    else if (result) {
      //#region Update class evaluation
      const evaluations = await generateUpdateAdviserEvaluation(
        result.id,
        request_code,
        params,
        result,
        evaluation_service,
        header_service,
        item_service,
        option_service,
        query_runner,
        req,
      );

      //#region throw HandlerException
      if (evaluations instanceof HttpException) throw evaluations;
      else if (evaluations) result.evaluations = evaluations;
      else {
        throw generateFailedResponse(
          req,
          ErrorMessage.OPERATOR_EVALUATION_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Generate response
      return await generateSuccessResponse(
        result,
        role_id,
        sheet_service,
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
};

export const generateDepartmentMarks = async (
  request_code: string,
  role_id: number,
  params: UpdateDepartmentMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  level_service: LevelService,
  option_service: OptionService,
  sheet_service: SheetService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<SheetDetailsResponse> | HttpException> => {
  //#region Validation
  //#region Validate evaluate time
  let valid: HandlerException | null = null;
  if (role_id !== RoleCode.ADMIN) {
    valid = await validateTime(sheet.form, req);
    if (valid instanceof HttpException) throw valid;
  }
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Update sheet
    const result = await generateUpdateSheet(
      request_code,
      SheetCategory.DEPARTMENT,
      SheetStatus.SUCCESS,
      params,
      sheet,
      item_service,
      header_service,
      level_service,
      sheet_service,
      query_runner,
      req,
    );
    //#endregion

    if (result instanceof HttpException) throw result;
    else if (result) {
      //#region Update department evaluation
      const evaluations = await generateUpdateDepartmentEvaluation(
        result.id,
        request_code,
        params,
        result,
        evaluation_service,
        header_service,
        item_service,
        option_service,
        query_runner,
        req,
      );

      //#region throw HandlerException
      if (evaluations instanceof HttpException) throw evaluations;
      else if (evaluations) result.evaluations = evaluations;
      else {
        throw generateFailedResponse(
          req,
          ErrorMessage.OPERATOR_EVALUATION_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Generate response
      return await generateSuccessResponse(
        result,
        role_id,
        sheet_service,
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
};

export const generateUngradeSheet = async (
  request_code: string,
  role_id: number,
  sheet: SheetEntity,
  sheet_service: SheetService,
  req: Request,
) => {
  //#region Ungrade (không xếp loại sinh viên)
  const result = await sheet_service.ungraded(sheet.id, request_code);
  if (result) {
    //#region Generate response
    return await generateSuccessResponse(sheet, role_id, null, null, req);
    //#endregion
  } else {
    //#region throw HandlerException
    return generateFailedResponse(req, ErrorMessage.OPERATOR_EVALUATION_ERROR);
    //#endregion
  }
  //#endregion
};

export const generateUpdateStudentEvaluation = async (
  sheet_id: number,
  request_code: string,
  params: UpdateStudentMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  file_service: FilesService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
): Promise<EvaluationEntity[] | HttpException> => {
  const evaluations: EvaluationEntity[] = [];
  let files: FileEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  //#region get id
  const header_ids = arr_items.map((e) => {
    return e[0];
  });
  const item_ids = generateItemIds(arr_items);
  const option_ids = generateOptionIds(arr_items);
  const file_ids = generateFileIds(arr_items);
  //#endregion

  const [headers, items, options, _files, student_evaluations] =
    await Promise.all([
      header_service.getHeaderByIds(header_ids),
      item_service.getItemByIds(item_ids),
      option_service.getOptionByIds(option_ids),
      file_service.getFileByIds(file_ids),
      evaluation_service.getEvaluationByItems(
        sheet_id,
        item_ids,
        EvaluationCategory.STUDENT,
      ),
    ]);

  for await (const item of arr_items) {
    //#region Validate Header
    const header = headers.find((e) => e.id == item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = items.find((e) => e.id == j.item_id);
        if (item) {
          //#region Validate option
          const valid_option = validateRequiredOption(item, j.option_id, req);
          if (valid_option instanceof HttpException) return valid_option;
          //#endregion

          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = options.find((e) => e.id == j.option_id);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(item, j.personal_mark_level, req);

          if (valid instanceof HttpException) return valid;
          //#endregion

          const evaluation = student_evaluations.find((e) => {
            j.item_id == e.item_id && e.category === EvaluationCategory.STUDENT;
          });
          if (evaluation) {
            //#region handle update file
            if (j.files) {
              if (!item.is_file) {
                return new HandlerException(
                  UNKNOW_EXIT_CODE.UNKNOW_ERROR,
                  req.method,
                  req.url,
                  ErrorMessage.CANNOT_UPLOAD_FILE_ITEM_ERROR,
                  HttpStatus.EXPECTATION_FAILED,
                );
              } else {
                //#region Count files by evaluation_id and sheet_id
                const count = await file_service.countFilesByItem(
                  item.id,
                  sheet.id,
                  evaluation.ref,
                );
                //#region Maximun files
                const valid = validateUpdateEvaluationMaxFile(
                  j.personal_mark_level,
                  count,
                  j.files,
                  item,
                  req,
                );
                if (valid instanceof HttpException) return valid;
                //#endregion
                //#endregion

                for (const _item of j.files) {
                  const file = _files.find((e) => e.id == _item.id);
                  if (file) {
                    if (_item.deleted) {
                      //#region Unlink file
                      file.drafted = true;
                      file.deleted_at = new Date();
                      file.deleted_by = request_code;
                      file.deleted = true;

                      files.push(file);
                      //#endregion
                    } else {
                      //#region Update file
                      file.sheet = sheet;
                      file.parent_ref = evaluation.ref;
                      file.item = item;
                      file.drafted = false;

                      files.push(file);
                      //#endregion
                    }
                  } else {
                    //#region throw HandlerException
                    return new UnknownException(
                      _item.id,
                      DATABASE_EXIT_CODE.UNKNOW_VALUE,
                      req.method,
                      req.url,
                      sprintf(ErrorMessage.FILE_NOT_FOUND_ERROR, _item.id),
                    );
                    //#endregion
                  }
                }
              }
            }
            //#endregion

            if (j.deleted) {
              //#region Check deleted
              evaluation.deleted = true;
              evaluation.deleted_at = new Date();
              evaluation.deleted_by = request_code;

              evaluations.push(evaluation);
              //#endregion
            } else {
              //#region Update evaluation
              evaluation.sheet = sheet;
              evaluation.item = item;
              evaluation.option = option ?? null;
              evaluation.personal_mark_level = j.personal_mark_level;
              evaluation.updated_at = new Date();
              evaluation.updated_by = request_code;
              evaluations.push(evaluation);
              //#endregion
            }
          } else {
            //#region Create evaluation
            const evaluation = new EvaluationEntity();
            evaluation.sheet = sheet;
            evaluation.item = item;
            evaluation.ref = randomUUID();
            evaluation.option = option;
            evaluation.personal_mark_level = j.personal_mark_level;
            evaluation.created_at = new Date();
            evaluation.created_by = request_code;

            evaluations.push(evaluation);
            //#endregion
            //#region handle update file
            if (j.files) {
              //#region validate Max files
              const valid = validateCreateEvaluationMaxFile(
                j.files,
                j.personal_mark_level,
                item,
                req,
              );
              if (valid instanceof HttpException) return valid;
              //#endregion

              if (!item.is_file) {
                return new HandlerException(
                  UNKNOW_EXIT_CODE.UNKNOW_ERROR,
                  req.method,
                  req.url,
                  ErrorMessage.CANNOT_UPLOAD_FILE_ITEM_ERROR,
                  HttpStatus.EXPECTATION_FAILED,
                );
              } else {
                for (const _item of j.files) {
                  const file = _files.find((e) => e.id == _item.id);
                  if (file) {
                    if (_item.deleted) {
                      //#region Unlink file
                      file.drafted = true;
                      file.deleted_at = new Date();
                      file.deleted_by = request_code;
                      file.drafted = true;

                      files.push(file);
                      //#endregion
                    } else {
                      //#region Update file
                      file.sheet = sheet;
                      file.parent_ref = evaluation.ref;
                      file.item = item;
                      file.drafted = false;

                      files.push(file);
                      //#endregion
                    }
                  } else {
                    //#region throw HandlerException
                    return new UnknownException(
                      _item.id,
                      DATABASE_EXIT_CODE.UNKNOW_VALUE,
                      req.method,
                      req.url,
                      sprintf(ErrorMessage.FILE_NOT_FOUND_ERROR, _item.id),
                    );
                    //#endregion
                  }
                }
              }
            }
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

  //#region delete file
  await file_service.delete(sheet_id, query_runner.manager);
  //#endregion

  files = await file_service.bulkUpdate(files, query_runner.manager);
  if (files) {
    //#region delete
    await evaluation_service.deleteEvaluation(
      sheet_id,
      EvaluationCategory.STUDENT,
    );
    //#endregion

    //#region Update evaluation
    await query_runner.manager.insert(EvaluationEntity, evaluations);
    //#endregion
    return evaluations;
  } else {
    return new HandlerException(
      SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
      req.method,
      req.url,
      ErrorMessage.OPERATOR_SHEET_ERROR,
      HttpStatus.EXPECTATION_FAILED,
    );
  }
};

export const generateUpdateClassEvaluation = async (
  sheet_id: number,
  request_code: string,
  params: UpdateClassMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const evaluations: EvaluationEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  //#region get id
  const header_ids = arr_items.map((e) => {
    return e[0];
  });
  const item_ids = generateItemIds(arr_items);
  const option_ids = generateOptionIds(arr_items);
  //#endregion

  const [headers, items, options, class_evaluations] = await Promise.all([
    await header_service.getHeaderByIds(header_ids),
    await item_service.getItemByIds(item_ids),
    await option_service.getOptionByIds(option_ids),
    await evaluation_service.getEvaluationByItems(
      sheet_id,
      item_ids,
      EvaluationCategory.CLASS,
    ),
  ]);

  for await (const item of arr_items) {
    //#region Validate Header
    const header = headers.find((e) => e.id == item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = items.find((e) => e.id == j.item_id);
        if (item) {
          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = options.find((e) => e.id == j.option_id);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(item, j.class_mark_level, req);

          if (valid instanceof HttpException) return valid;
          //#endregion

          const class_evaluation = class_evaluations.find((e) => {
            j.item_id == e.item_id && e.category === EvaluationCategory.CLASS;
          });

          if (class_evaluation) {
            //#region Update evaluation
            if (j.deleted) {
              class_evaluation.deleted = true;
              class_evaluation.deleted_at = new Date();
              class_evaluation.deleted_by = request_code;

              evaluations.push(class_evaluation);
            } else {
              //#region Update evaluation
              class_evaluation.sheet = sheet;
              class_evaluation.item = item;
              class_evaluation.option = option ?? null;
              class_evaluation.class_mark_level = j.class_mark_level;
              class_evaluation.updated_at = new Date();
              class_evaluation.updated_by = request_code;
              evaluations.push(class_evaluation);
              //#endregion
            }
            //#endregion
          } else {
            //#region Create evaluation
            const new_evaluation = new EvaluationEntity();
            new_evaluation.sheet = sheet;
            new_evaluation.item = item;
            new_evaluation.option = option ?? null;
            new_evaluation.category = EvaluationCategory.CLASS;
            new_evaluation.class_mark_level = j.class_mark_level;
            new_evaluation.created_at = new Date();
            new_evaluation.created_by = request_code;
            evaluations.push(new_evaluation);
            //#endregion
          }
        } else {
          //#region throw HandlerException
          return new UnknownException(
            j.item_id,
            DATABASE_EXIT_CODE.UNKNOW_VALUE,
            req.method,
            req.url,
            sprintf(ErrorMessage.ITEM_NOT_FOUND_ERROR, j.item_id),
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

  //#region delete
  await evaluation_service.deleteEvaluation(
    sheet_id,
    EvaluationCategory.ADVISER,
  );
  //#endregion

  //#region Update evaluation
  await query_runner.manager.insert(EvaluationEntity, evaluations);
  //#endregion

  return evaluations;
};

export const generateUpdateAdviserEvaluation = async (
  sheet_id: number,
  request_code: string,
  params: UpdateAdviserMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const evaluations: EvaluationEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  //#region get id
  const header_ids = arr_items.map((e) => {
    return e[0];
  });
  const item_ids = generateItemIds(arr_items);
  const option_ids = generateOptionIds(arr_items);
  //#endregion

  const [headers, items, options, adviser_evaluations] = await Promise.all([
    header_service.getHeaderByIds(header_ids),
    item_service.getItemByIds(item_ids),
    option_service.getOptionByIds(option_ids),
    evaluation_service.getEvaluationByItems(
      sheet_id,
      item_ids,
      EvaluationCategory.ADVISER,
    ),
  ]);

  for await (const item of arr_items) {
    //#region Validate Header
    const header = headers.find((e) => e.id == item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = items.find((e) => e.id == j.item_id);
        if (item) {
          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = options.find((e) => e.id == j.option_id);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(item, j.adviser_mark_level, req);

          if (valid instanceof HttpException) return valid;
          //#endregion

          const adviser_evaluation = adviser_evaluations.find((e) => {
            j.item_id == e.item_id && e.category === EvaluationCategory.ADVISER;
          });

          if (adviser_evaluation) {
            //#region Update evaluation
            if (j.deleted) {
              adviser_evaluation.deleted = true;
              adviser_evaluation.deleted_at = new Date();
              adviser_evaluation.deleted_by = request_code;

              evaluations.push(adviser_evaluation);
            } else {
              //#region Update evaluation
              adviser_evaluation.sheet = sheet;
              adviser_evaluation.item = item;
              adviser_evaluation.option = option ?? null;
              adviser_evaluation.adviser_mark_level = j.adviser_mark_level;
              adviser_evaluation.updated_at = new Date();
              adviser_evaluation.updated_by = request_code;
              evaluations.push(adviser_evaluation);
              //#endregion
            }
            //#endregion
          } else {
            //#region Create evaluation
            const new_evaluation = new EvaluationEntity();
            new_evaluation.sheet = sheet;
            new_evaluation.item = item;
            new_evaluation.option = option ?? null;
            new_evaluation.category = EvaluationCategory.ADVISER;
            new_evaluation.adviser_mark_level = j.adviser_mark_level;
            new_evaluation.created_at = new Date();
            new_evaluation.created_by = request_code;
            evaluations.push(new_evaluation);
            //#endregion
          }
        } else {
          //#region throw HandlerException
          return new UnknownException(
            j.item_id,
            DATABASE_EXIT_CODE.UNKNOW_VALUE,
            req.method,
            req.url,
            sprintf(ErrorMessage.ITEM_NOT_FOUND_ERROR, j.item_id),
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

  //#region delete
  await evaluation_service.deleteEvaluation(
    sheet_id,
    EvaluationCategory.ADVISER,
  );
  //#endregion

  //#region Update evaluation
  await query_runner.manager.insert(EvaluationEntity, evaluations);
  //#endregion

  return evaluations;
};

export const generateUpdateDepartmentEvaluation = async (
  sheet_id: number,
  request_code: string,
  params: UpdateDepartmentMarkDto,
  sheet: SheetEntity,
  evaluation_service: EvaluationService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
) => {
  const evaluations: EvaluationEntity[] = [];

  //#region Get params
  const { data } = params;
  const arr_items = groupItemsByHeader(data, GROUP_KEY);
  //#endregion

  //#region get id
  const header_ids = arr_items.map((e) => {
    return e[0];
  });
  const item_ids = generateItemIds(arr_items);
  const option_ids = generateOptionIds(arr_items);
  //#endregion

  const [headers, items, options, department_evaluations] = await Promise.all([
    await header_service.getHeaderByIds(header_ids),
    await item_service.getItemByIds(item_ids),
    await option_service.getOptionByIds(option_ids),
    await evaluation_service.getEvaluationByItems(
      sheet_id,
      item_ids,
      EvaluationCategory.DEPARTMENT,
    ),
  ]);

  for await (const item of arr_items) {
    //#region Validate Header
    const header = headers.find((e) => e.id == item[0]);
    if (header) {
      for await (const j of item[1]) {
        const item = items.find((e) => e.id == j.item_id);
        if (item) {
          //#region Get option
          let option: OptionEntity | null = null;
          if (j.option_id) {
            option = options.find((e) => e.id == j.option_id);
          }
          //#endregion

          //#region Validate mark evaluation
          const valid = validateMark(item, j.department_mark_level, req);

          if (valid instanceof HttpException) return valid;
          //#endregion

          const department_evaluation = department_evaluations.find((e) => {
            j.item_id == e.item_id && e.category === EvaluationCategory.ADVISER;
          });

          if (department_evaluation) {
            if (j.deleted) {
              //#region delete evaluation
              department_evaluation.deleted = true;
              department_evaluation.deleted_at = new Date();
              department_evaluation.deleted_by = request_code;

              evaluations.push(department_evaluation);
              //#endregion
            } else {
              //#region Update evaluation
              department_evaluation.sheet = sheet;
              department_evaluation.item = item;
              department_evaluation.option = option ?? null;
              department_evaluation.department_mark_level =
                j.department_mark_level;
              department_evaluation.updated_at = new Date();
              department_evaluation.updated_by = request_code;
              evaluations.push(department_evaluation);
              //#endregion
            }
          } else {
            //#region Create evaluation
            const new_evaluation = new EvaluationEntity();
            new_evaluation.sheet = sheet;
            new_evaluation.item = item;
            new_evaluation.option = option ?? null;
            new_evaluation.category = EvaluationCategory.DEPARTMENT;
            new_evaluation.department_mark_level = j.department_mark_level;
            new_evaluation.created_at = new Date();
            new_evaluation.created_by = request_code;
            evaluations.push(new_evaluation);
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

  //#region delete
  await evaluation_service.deleteEvaluation(
    sheet_id,
    EvaluationCategory.DEPARTMENT,
  );
  //#endregion

  //#region Update evaluation
  await query_runner.manager.insert(EvaluationEntity, evaluations);
  //#endregion

  return evaluations;
};

export const generateUpdateSheet = async (
  request_code: string,
  category: SheetCategory,
  status: SheetStatus,
  params:
    | UpdateStudentMarkDto
    | UpdateClassMarkDto
    | UpdateAdviserMarkDto
    | UpdateDepartmentMarkDto,
  sheet: SheetEntity,
  item_service: ItemService,
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
  } else if (data instanceof AdviserMarkDtos) {
    arr_items = groupItemsByHeader(data as AdviserMarkDtos[], GROUP_KEY);
  } else {
    arr_items = groupItemsByHeader(data as DepartmentMarkDtos[], GROUP_KEY);
  }
  //#endregion

  const header_ids = arr_items.map((e) => {
    return e[0];
  });
  const headers = await header_service.getHeaderByIds(header_ids);

  //#region Calculate sum of marks
  let sum_of_marks = 0;
  for (const item of arr_items) {
    const header = headers.find((e) => e.id == item[0]);
    if (header) {
      let sum_of_mark_items = 0;
      for (const j of item[1]) {
        if (!j.deleted) {
          if (j instanceof StudentMarkDtos) {
            sum_of_mark_items += j.personal_mark_level;
          } else if (j instanceof ClassMarkDtos) {
            sum_of_mark_items += j.class_mark_level;
          } else if (j instanceof AdviserMarkDtos) {
            sum_of_mark_items += j.adviser_mark_level;
          } else sum_of_mark_items += j.department_mark_level;
        }
      }

      sum_of_mark_items = header.is_return
        ? header.max_mark > sum_of_mark_items
          ? sum_of_mark_items
          : header.max_mark
        : sum_of_mark_items;

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
  sum_of_marks = sum_of_marks > 100 ? 100 : sum_of_marks < 0 ? 0 : sum_of_marks;
  const level = await getLevel(sum_of_marks, level_service, req);
  if (level instanceof HttpException) return level;
  //#endregion

  //#region Get level by sort order
  const new_level = await getLevelBySortOrder(
    params,
    level,
    item_service,
    level_service,
    req,
  );
  if (new_level instanceof HttpException) return new_level;
  //#endregion

  if (category === SheetCategory.STUDENT)
    sheet.sum_of_personal_marks = sum_of_marks;
  else if (category === SheetCategory.CLASS)
    sheet.sum_of_class_marks = sum_of_marks;
  else if (category === SheetCategory.ADVISER)
    sheet.sum_of_adviser_marks = sum_of_marks;
  else sheet.sum_of_department_marks = sum_of_marks;

  //#region hoàn tác cho cbl là cvht
  sheet.status =
    sheet.status < status || sheet.status === SheetStatus.NOT_GRADED
      ? status
      : sheet.status;
  sheet.graded = 1;
  sheet.level =
    sheet.status <= status || sheet.status === SheetStatus.NOT_GRADED
      ? new_level
      : sheet.level;
  //#endregion
  sheet.updated_at = new Date();
  sheet.updated_by = request_code;

  sheet = await sheet_service.update(sheet, query_runner.manager);
  return sheet;
};

export const getLevel = async (
  mark: number,
  level_service: LevelService,
  req: Request,
) => {
  //#region convert mark when mark upper 100
  mark = mark > 100 ? 100 : mark < 0 ? 0 : mark;

  //#endregion
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

export const getLevelBySortOrder = async (
  params:
    | UpdateStudentMarkDto
    | UpdateClassMarkDto
    | UpdateAdviserMarkDto
    | UpdateDepartmentMarkDto,
  level: LevelEntity,
  item_service: ItemService,
  level_service: LevelService,
  req: Request,
) => {
  let ids = params.data.map((item) => {
    if (item instanceof StudentMarkDtos) {
      if (item.personal_mark_level) {
        return item.item_id;
      }
    } else if (item instanceof ClassMarkDtos) {
      if (item.class_mark_level) {
        return item.item_id;
      }
    } else if (item instanceof AdviserMarkDtos) {
      if (item.adviser_mark_level) {
        return item.item_id;
      }
    } else if (item instanceof DepartmentMarkDtos) {
      if (item.department_mark_level) {
        return item.item_id;
      }
    }
  });

  //#region Remove Item undefined
  ids = ids.filter(function (element) {
    return element !== undefined;
  });
  //#endregion

  const sort_order = await item_service.getMaxSortOrder(ids);
  if (!sort_order) {
    //#region throw HandleException
    return new UnknownException(
      JSON.stringify(ids),
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ITEM_NOT_FOUND_ERROR, JSON.stringify(ids)),
    );
    //#endregion
  }
  if (level.sort_order >= sort_order) return level;

  //#region new level
  const new_level = await level_service.getLevelBySortOrder(sort_order);
  if (!new_level) {
    //#region throw HandleException
    return new UnknownException(
      sort_order,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.LEVEL_BY_SORT_ORDER_NOT_FOUND_ERROR, sort_order),
    );
    //#endregion
  }
  return new_level;
  //#endregion
};
