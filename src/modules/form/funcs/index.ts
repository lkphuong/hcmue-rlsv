import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, QueryRunner } from 'typeorm';

import { sprintf } from '../../../utils';

import {
  generateFailedResponse,
  generateResponseForm,
  generateResponseHeader,
  generateResponseItem,
  generateResponseTitle,
} from '../utils';

import {
  valiadteTitle,
  validateAcademicYear,
  validateHeader,
  validateSemester,
  validateTime,
} from '../validations';

import { HeaderEntity } from '../../../entities/header.entity';
import { FormEntity } from '../../../entities/form.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { OptionEntity } from '../../../entities/option.entity';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  BaseResponse,
  FormInfoResponse,
  ItemResponse,
} from '../interfaces/form_response.interface';

import { HeaderService } from '../../header/services/header.service';
import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { SemesterService } from '../../semester/services/semester.service';
import { TitleService } from '../../title/services/title.service';
import { ItemService } from '../../item/services/item.service';
import { OptionService } from '../../option/services/option.service';
import { FormService } from '../services/form.service';

import { HeaderDto } from '../dtos/header.dto';
import { FormDto } from '../dtos/form.dto';
import { TitleDto } from '../dtos/title.dto';
import { ItemDto } from '../dtos/item.dto';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/errors.enum';

export const createForm = async (
  user_id: string,
  params: FormDto,
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

    return await generateResponseForm(result, query_runner, req);
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

export const createHeader = async (
  user_id: string,
  params: HeaderDto,
  header_service: HeaderService,
  form_service: FormService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Get params
  const { form_id, name } = params;
  //#endregion

  //Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();
    //#region Validate form_id
    const form = await form_service.getFormById(form_id);
    if (form) {
      //#region add data header
      const header = new HeaderEntity();
      header.form = form;
      header.name = name;
      header.created_by = user_id;
      header.created_at = new Date();
      header.updated_by = user_id;
      header.updated_at = new Date();
      header.active = true;
      header.deleted = false;
      //#endregion

      //#region Update header
      const result = await header_service.add(header, query_runner.manager);
      if (result) {
        return await generateResponseHeader(header, query_runner, req);
      } else {
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_HEADERS_ERROR);
      }
      //#endregion
    } else {
      //#region Throw exception
      throw new UnknownException(
        form_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
      );
      //#endregion
    }
    //#endregion
    //#endregion
  } catch (err) {
    console.log(err);
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('--------------------------------------------------------');
    console.log(req.method + ' - ' + req.url + ': ' + err.message);

    if (err instanceof HttpException) return err;
    else {
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};

export const createTitle = async (
  user_id: string,
  param: TitleDto,
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

    const result = await title_service.add(title, query_runner.manager);
    if (result) {
      return await generateResponseTitle(title, query_runner, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_TITLE_ERROR);
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

export const createItem = async (
  user_id: string,
  params: ItemDto,
  title_service: TitleService,
  option_service: OptionService,
  item_serviec: ItemService,
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
    let item = await generateCreateItem(
      user_id,
      params,
      title,
      item_serviec,
      query_runner,
    );
    //#endregion

    if (item) {
      if (params.options && params.options.length > 0) {
        const option = await createItemOption(
          user_id,
          params,
          item,
          option_service,
          query_runner,
        );
        if (option) item.options = option;
        else {
          throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
        }
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
      return await generateResponseItem(item, query_runner, req);
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

export const updateForm = async (
  form_id: number,
  user_id: string,
  params: FormDto,
  form_service: FormService,
  academic_service: AcademicYearService,
  semester_service: SemesterService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<FormInfoResponse> | HttpException> => {
  let form = await form_service.getFormById(form_id);
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

      form = await form_service.update(form, query_runner.manager);

      if (form) {
        return await generateResponseForm(form, query_runner, req);
      } else {
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
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
      form_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
    );
    //#endregion
  }
};

export const updateHeader = async (
  id: number,
  user_id: string,
  params: HeaderDto,
  header_service: HeaderService,
  form_service: FormService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Get params
  const { form_id, name } = params;
  //#endregion

  //Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  // Establish real database connection
  await query_runner.connect();

  let header: HeaderEntity | HttpException | null = null;
  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Validate title
    header = await header_service.getHeaderById(id);
    if (header) {
      //#region Validate form_id
      const form = await form_service.getFormById(form_id);
      if (form) {
        //#region Update data header
        header.form = form;
        header.name = name;
        header.updated_by = user_id;
        header.updated_at = new Date();
        //#endregion

        //#region Update header
        header = await header_service.update(header, query_runner.manager);
        //#endregion

        if (header) {
          return await generateResponseHeader(header, query_runner, req);
        } else {
          throw generateFailedResponse(
            req,
            ErrorMessage.OPERATOR_HEADERS_ERROR,
          );
        }
      } else {
        //#region Throw exception
        throw new UnknownException(
          form_id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
        );
        //#endregion
      }
      //#endregion
    } else {
      //#region Throw exception
      throw new UnknownException(
        id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, id),
      );
      //#endregion
    }
    //#endregion
  } catch (err) {
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('--------------------------------------------------------');
    console.log(req.method + ' - ' + req.url + ': ' + err.message);

    if (err instanceof HttpException) return err;
    else {
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};

export const updateTitle = async (
  title_id: number,
  user_id: string,
  param: TitleDto,
  header_service: HeaderService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<BaseResponse> | HttpException> => {
  let title = await title_service.getTitleById(title_id);
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

      title = await title_service.update(title, query_runner.manager);

      if (title) {
        return await generateResponseTitle(title, query_runner, req);
      } else {
        throw generateFailedResponse(req, ErrorMessage.OPERATOR_TITLE_ERROR);
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
      title_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.TITLE_NOT_FOUND_ERROR, title_id),
    );
    //#endregion
  }
};

export const updateItem = async (
  user_id: string,
  item_id: number,
  params: ItemDto,
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

      //#region Get Option
      const options = await option_service.getOptionByItemId(item_id);
      //#endregion

      if (options && options.length > 0) {
        //#region Delete Option
        const success = await option_service.bulkUnlinkByItemId(
          item_id,
          user_id,
          query_runner.manager,
        );
        if (!success)
          throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
        //#endregion
      }
      //#region Create Item
      let item = await generateCreateItem(
        user_id,
        params,
        title,
        item_serviec,
        query_runner,
      );
      //#endregion

      if (item) {
        if (params.options && params.options.length > 0) {
          const option = await createItemOption(
            user_id,
            params,
            item,
            option_service,
            query_runner,
          );

          if (option) item.options = option;
          else {
            throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
          }
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
        return await generateResponseItem(item, query_runner, req);
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
  params: ItemDto,
  title: TitleEntity,
  item_serviec: ItemService,
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
  item.deleted = false;

  item = await item_serviec.add(item, query_runner.manager);

  return item;
};

export const createItemOption = async (
  user_id: string,
  params: ItemDto,
  item: ItemEntity,
  option_service: OptionService,
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
  item_options = await option_service.bulkAdd(
    item_options,
    query_runner.manager,
  );
  //#endregion

  return item_options;
};
