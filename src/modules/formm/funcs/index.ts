import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, QueryRunner } from 'typeorm';

import { sprintf } from '../../../utils';

import { FormEntity } from '../../../entities/form.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { OptionEntity } from '../../../entities/option.entity';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { HeaderService } from '../../header/services/header.service';
import { TitleService } from '../../title/services/title.service';
import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { FormmService } from '../service/service.service';
import { SemesterService } from '../../semester/services/semester.service';
import { ItemService } from '../../item/services/item.service';
import { OptionService } from '../../option/services/option.service';

import { CreateFormDto } from '../dtos/add_form.dto';
import { CreateTitleDto } from '../dtos/add_title.dto';
import { CreateItemDto } from '../dtos/add_item.dto';

import {
  generateDataCreateForm2Object,
  generateDataItem2Object,
  generateDataTitle2Object,
  generateFailedResponse,
} from '../utils';
import {
  valiadteTitle,
  validateAcademicYear,
  validateHeader,
  validateSemester,
  validateTime,
} from '../validations';
import { ErrorMessage } from '../constants/errors.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from 'src/constants/enums/error-code.enum';
import { HttpResponse } from 'src/interfaces/http-response.interface';
import {
  BaseResponse,
  CreateFormResponse,
  ItemResponse,
} from '../interfaces/form_response.interface';

export const createForm = async (
  user_id: string,
  params: CreateFormDto,
  academic_service: AcademicYearService,
  semester_service: SemesterService,
  data_source: DataSource,
  req: Request,
) => {
  const { academic_id, classes, department, semester_id, student } = params;

  //#region Validation time
  let valid = validateTime(student.start, student.end, req);
  if (valid instanceof HttpException) throw valid;

  valid = validateTime(classes.start, classes.end, req);
  if (valid instanceof HttpException) throw valid;

  valid = validateTime(department.start, department.end, req);
  if (valid instanceof HttpException) throw valid;

  const academic = await validateAcademicYear(
    academic_id,
    academic_service,
    req,
  );
  if (academic instanceof HttpException) throw academic;

  const semester = await validateSemester(semester_id, semester_service, req);
  if (semester instanceof HttpException) throw semester;
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  await query_runner.connect();
  try {
    // Start transaction
    await query_runner.startTransaction();

    const form = new FormEntity();
    form.academic_year = academic;
    form.semester = semester;
    form.student_start = new Date(student.start);
    form.student_end = new Date(student.end);
    form.class_start = new Date(classes.start);
    form.class_end = new Date(classes.end);
    form.department_start = new Date(department.start);
    form.department_end = new Date(department.end);
    form.created_at = new Date();
    form.created_by = user_id;

    const result = await query_runner.manager.save(form);

    return await generateDataCreateForm2Object(result, query_runner, req);
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

export const updateForm = async (
  form_id: number,
  user_id: string,
  params: CreateFormDto,
  form_service: FormmService,
  academic_service: AcademicYearService,
  semester_service: SemesterService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<CreateFormResponse> | HttpException> => {
  const form = await form_service.getFormById(form_id);
  if (form) {
    const { academic_id, classes, department, semester_id, student } = params;

    //#region Validation time
    let valid = validateTime(student.start, student.end, req);
    if (valid instanceof HttpException) throw valid;

    valid = validateTime(classes.start, classes.end, req);
    if (valid instanceof HttpException) throw valid;

    valid = validateTime(department.start, department.end, req);
    if (valid instanceof HttpException) throw valid;

    const academic = await validateAcademicYear(
      academic_id,
      academic_service,
      req,
    );
    if (academic instanceof HttpException) throw academic;

    const semester = await validateSemester(semester_id, semester_service, req);
    if (semester instanceof HttpException) throw semester;
    //#endregion

    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();

    await query_runner.connect();
    try {
      // Start transaction
      await query_runner.startTransaction();

      const update_form = await form_service.update(
        form_id,
        query_runner.manager,
      );
      if (!update_form) {
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
      }

      form.academic_year = academic;
      form.semester = semester;
      form.student_start = new Date(student.start);
      form.student_end = new Date(student.end);
      form.class_start = new Date(classes.start);
      form.class_end = new Date(classes.end);
      form.department_start = new Date(department.start);
      form.department_end = new Date(department.end);
      form.created_at = new Date();
      form.created_by = user_id;

      const result = await query_runner.manager.save(form);

      return await generateDataCreateForm2Object(result, query_runner, req);
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
      form_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
    );
    //#endregion
  }
};

export const createTile = async (
  user_id: string,
  param: CreateTitleDto,
  header_service: HeaderService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<BaseResponse> | HttpException> => {
  const { header_id, name } = param;

  //#region Validation
  const header = await validateHeader(header_id, header_service, req);
  if (header instanceof HttpException) throw header;
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  await query_runner.connect();
  try {
    // Start transaction
    await query_runner.startTransaction();

    const title = new TitleEntity();
    title.header = header;
    title.name = name;
    title.created_at = new Date();
    title.created_by = user_id;

    const result = await query_runner.manager.save(title);

    return await generateDataTitle2Object(result, query_runner, req);
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

export const updateTitle = async (
  title_id: number,
  user_id: string,
  param: CreateTitleDto,
  header_service: HeaderService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<BaseResponse> | HttpException> => {
  const title = await title_service.getTitleById(title_id);
  if (title) {
    const { header_id, name } = param;

    //#region Validation
    const header = await validateHeader(header_id, header_service, req);
    if (header instanceof HttpException) throw header;
    //#endregion

    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();
    try {
      // Start transaction
      await query_runner.startTransaction();

      title.header = header;
      title.name = name;
      title.updated_at = new Date();
      title.updated_by = user_id;

      const result = await query_runner.manager.save(title);

      return await generateDataTitle2Object(result, query_runner, req);
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
      title_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.TITLE_NOT_FOUND_ERROR, title_id),
    );
    //#endregion
  }
};

export const createItem = async (
  user_id: string,
  params: CreateItemDto,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<ItemResponse> | HttpException> => {
  const { title_id } = params;

  //#region Validate Title
  const title = await valiadteTitle(title_id, title_service, req);

  if (title instanceof HttpException) throw title;
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  await query_runner.connect();
  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Create Item
    let item = await generateCreateItem(user_id, params, title, query_runner);
    //#endregion

    if (item) {
      const option = await createItemOption(
        user_id,
        params,
        item,
        query_runner,
      );

      if (option) item.options = option;
      else {
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
      }

      //#region Update Item relation
      item = await query_runner.manager.save(item);
      if (!item) {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.OPERATOR_ITEM_ERROR,
          HttpStatus.EXPECTATION_FAILED,
        );
        //#endregion
      }

      //#region Generate response
      return await generateDataItem2Object(item, query_runner, req);
      //#endregion
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
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

export const updateItem = async (
  user_id: string,
  item_id: number,
  params: CreateItemDto,
  title_service: TitleService,
  item_serviec: ItemService,
  option_service: OptionService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<ItemResponse> | HttpException> => {
  const item = await item_serviec.getItemById(item_id);

  if (item) {
    const { title_id } = params;

    //#region Validation Iteme
    const title = await valiadteTitle(title_id, title_service, req);
    if (title instanceof HttpException) throw title;
    //#endregion
    // Make the QueryRunner
    const query_runner = data_source.createQueryRunner();

    await query_runner.connect();
    try {
      // Start transaction
      await query_runner.startTransaction();

      //#region Delete Option
      const success = await option_service.bulkUnlinkByItemId(item_id, user_id);
      if (!success)
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
      //#endregion

      //#region Create Item
      let item = await generateCreateItem(user_id, params, title, query_runner);
      //#endregion

      if (item) {
        const option = await createItemOption(
          user_id,
          params,
          item,
          query_runner,
        );

        if (option) item.options = option;
        else {
          throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
        }

        //#region Update Item relation
        item = await query_runner.manager.save(item);
        if (!item) {
          //#region throw HandlerException
          throw new HandlerException(
            DATABASE_EXIT_CODE.OPERATOR_ERROR,
            req.method,
            req.url,
            ErrorMessage.OPERATOR_ITEM_ERROR,
            HttpStatus.EXPECTATION_FAILED,
          );
          //#endregion
        }

        //#region Generate response
        return await generateDataItem2Object(item, query_runner, req);
        //#endregion
      } else {
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
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
      item_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, item_id),
    );
    //#endregion
  }
};

export const generateCreateItem = async (
  user_id: string,
  params: CreateItemDto,
  title: TitleEntity,
  query_runner: QueryRunner,
) => {
  //#region Get params
  const {
    content,
    control,
    unit,
    category,
    from_mark,
    multiple,
    required,
    to_mark,
  } = params;
  //#endregion

  let item = new ItemEntity();
  item.title = title;
  item.control = control;
  item.multiple = multiple;
  item.content = content;
  item.from_mark = from_mark;
  item.to_mark = to_mark;
  item.category = category;
  item.unit = unit;
  item.required = required;
  item.created_at = new Date();
  item.updated_by = user_id;

  item = await query_runner.manager.save(item);

  return item;
};

export const createItemOption = async (
  user_id: string,
  params: CreateItemDto,
  item: ItemEntity,
  query_runner: QueryRunner,
) => {
  let item_options: OptionEntity[] = [];

  //#region Get params
  const { options } = params;
  //#endregion

  for (const i of options) {
    const option = new OptionEntity();
    option.item = item;
    option.content = i.content;
    option.from_mark = i.from_mark;
    option.to_mark = i.to_mark;
    option.content = i.content;
    option.created_at = new Date();
    option.created_by = user_id;

    item_options.push(option);
  }

  //#region Create Option
  item_options = await query_runner.manager.save(item_options);
  //#endregion

  return item_options;
};
