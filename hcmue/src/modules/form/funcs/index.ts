import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, QueryRunner } from 'typeorm';
import { randomUUID } from 'crypto';

import {
  generateFailedResponse,
  generateFormResponse,
  generateHeaderResponse,
  generateItemResponse,
  generateTitleResponse,
} from '../utils';

import {
  valiadteItem,
  valiadteTitle,
  validateAcademicYear,
  validateEditFormInProgressOrDone,
  validateForm,
  validateFormExist,
  validateFormPubishStatus,
  validateHeader,
  validateMaxMarkHeaderByForm,
  validateRequiredOption,
  validateSemester,
  validateTime,
} from '../validations';

import { HeaderDto } from '../dtos/header.dto';
import { FormDto } from '../dtos/form.dto';
import { TitleDto } from '../dtos/title.dto';
import { ItemDto, OptionDto } from '../dtos/item.dto';

import { FormEntity } from '../../../entities/form.entity';
import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { OptionEntity } from '../../../entities/option.entity';
import { TitleEntity } from '../../../entities/title.entity';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  BaseResponse,
  FormResponse,
  ItemResponse,
} from '../interfaces/form-response.interface';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { FormService } from '../services/form.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { OptionService } from '../../option/services/option.service';
import { SemesterService } from '../../semester/services/semester.service';
import { TitleService } from '../../title/services/title.service';

import { FormStatus } from '../constants/enums/statuses.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const createForm = async (
  request_code: string,
  params: FormDto,
  academic_service: AcademicYearService,
  form_service: FormService,
  semester_service: SemesterService,
  req: Request,
) => {
  //#region Get params
  const { academic_id, end, semester_id, start } = params;
  //#endregion

  //#region Validation
  //#region Validate times
  const valid = validateTime(start, end, req);
  if (valid instanceof HttpException) return valid;
  //#endregion
  //#endregion

  //#region Validate academic year
  const academic = await validateAcademicYear(
    academic_id,
    academic_service,
    req,
  );

  if (academic instanceof HttpException) return academic;
  //#endregion

  //#region Validate semester
  const semester = await validateSemester(semester_id, semester_service, req);
  if (semester instanceof HttpException) return semester;
  //#endregion
  //#endregion

  try {
    //#region Create form
    let form = new FormEntity();
    form.academic_year = academic;
    form.semester = semester;
    form.start = new Date(start);
    form.end = new Date(end);
    form.status = FormStatus.DRAFTED;

    form.created_by = request_code;
    form.created_at = new Date();
    //#endregion

    //#region Generate response
    form = await form_service.add(form);
    if (form) {
      return await generateFormResponse(form, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const createHeader = async (
  request_code: string,
  params: HeaderDto,
  form_service: FormService,
  header_service: HeaderService,
  req: Request,
) => {
  //#region Get params
  const { form_id, name, max_mark, is_return } = params;
  //#endregion

  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate mark mark
  const valid_mark = await validateMaxMarkHeaderByForm(
    null,
    form_id,
    max_mark,
    header_service,
    req,
  );
  if (valid_mark instanceof HttpException) throw valid_mark;
  //#endregion
  //#endregion

  try {
    //#region Create header
    let header = new HeaderEntity();
    header.form = form;
    header.ref = randomUUID();
    header.name = name;
    header.max_mark = max_mark;
    header.is_return = is_return;

    header.created_by = request_code;
    header.created_at = new Date();
    //#endregion

    //#region Generate response
    header = await header_service.add(header);
    if (header) {
      return await generateHeaderResponse(header, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_HEADERS_ERROR);
    }
    //#endregion
    //#endregion
  } catch (err) {
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
  }
};

export const createTitle = async (
  request_code: string,
  param: TitleDto,
  form_service: FormService,
  header_service: HeaderService,
  title_service: TitleService,
  req: Request,
): Promise<HttpResponse<BaseResponse> | HttpException> => {
  //#region Get params
  const { form_id, header_id, name } = param;
  //#endregion

  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate header
  const header = await validateHeader(header_id, header_service, req);
  if (header instanceof HttpException) return header;
  //#endregion
  //#endregion

  try {
    //#region Create title
    let title = new TitleEntity();
    title.form = form;
    title.parent_ref = header.ref;
    title.ref = randomUUID();
    title.name = name;

    title.created_at = new Date();
    title.created_by = request_code;
    //#endregion

    //#region Generate response
    title = await title_service.add(title);
    if (title) {
      return await generateTitleResponse(title, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_TITLE_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const createItem = async (
  request_code: string,
  params: ItemDto,
  form_service: FormService,
  item_serviec: ItemService,
  option_service: OptionService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<ItemResponse> | HttpException> => {
  //#region Get params
  const { form_id, title_id, control, options } = params;
  //#endregion

  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate title
  const title = await valiadteTitle(title_id, title_service, req);
  if (title instanceof HttpException) return title;
  //#endregion

  //#region Validate required option
  const valid_option = validateRequiredOption(control, options, req);
  if (valid_option instanceof HttpException) return valid_option;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Create item
    let item = await generateCreateItem(
      request_code,
      params,
      form,
      title,
      item_serviec,
      query_runner,
    );
    //#endregion

    if (item) {
      //#region Create options
      const options = params.options;
      if (options && options.length > 0) {
        const results = await createItemOptions(
          request_code,
          options,
          form,
          item,
          option_service,
          query_runner,
        );

        if (!results) {
          throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
        } else item.options = results;
      }
      //#endregion

      //#region Update item relation
      item = await query_runner.manager.save(item);
      //#endregion

      //#region Generate response
      return await generateItemResponse(item, query_runner, req);
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
  request_code: string,
  params: FormDto,
  academic_service: AcademicYearService,
  form_service: FormService,
  semester_service: SemesterService,
  req: Request,
): Promise<HttpResponse<FormResponse> | HttpException> => {
  //#region Get params
  const { academic_id, end, semester_id, start } = params;
  //#endregion

  //#region Validation
  //#region Validate form
  let form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form status
  let valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate times
  valid = validateTime(start, end, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate academic year
  const academic = await validateAcademicYear(
    academic_id,
    academic_service,
    req,
  );

  if (academic instanceof HttpException) return academic;
  //#endregion

  //#region Validate semester
  const semester = await validateSemester(semester_id, semester_service, req);
  if (semester instanceof HttpException) return semester;
  //#endregion
  //#endregion

  try {
    //#region Update form
    form.academic_year = academic;
    form.semester = semester;
    form.start = new Date(start);
    form.end = new Date(end);
    form.status = FormStatus.DRAFTED;
    form.updated_by = request_code;
    form.updated_at = new Date();
    //#endregion

    //#region Generate response
    form = await form_service.update(form);
    if (form) {
      return await generateFormResponse(form, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const updateHeader = async (
  header_id: number,
  request_code: string,
  params: HeaderDto,
  form_service: FormService,
  header_service: HeaderService,
  req: Request,
) => {
  //#region Get params
  const { form_id, name, max_mark, is_return } = params;
  //#endregion

  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form in progress or done
  const valid_form = validateEditFormInProgressOrDone(form, req);
  if (valid_form instanceof HttpException) throw valid_form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate header
  let header = await validateHeader(header_id, header_service, req);
  if (header instanceof HttpException) return header;
  //#endregion

  //#region Validate mark mark
  const valid_mark = await validateMaxMarkHeaderByForm(
    header_id,
    form_id,
    max_mark,
    header_service,
    req,
  );
  if (valid_mark instanceof HttpException) throw valid_mark;
  //#endregion
  //#endregion

  try {
    //#region Update header
    header.form = form;
    header.name = name;
    header.max_mark = max_mark;
    header.is_return = is_return;

    header.updated_by = request_code;
    header.updated_at = new Date();
    //#endregion

    //#region Generate response
    header = await header_service.update(header);
    if (header) {
      return await generateHeaderResponse(header, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_HEADERS_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const updateTitle = async (
  title_id: number,
  request_code: string,
  param: TitleDto,
  form_service: FormService,
  header_service: HeaderService,
  title_service: TitleService,
  req: Request,
): Promise<HttpResponse<BaseResponse> | HttpException> => {
  //#region Get params
  const { form_id, header_id, name } = param;
  //#endregion

  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form in progress or done
  const valid_form = validateEditFormInProgressOrDone(form, req);
  if (valid_form instanceof HttpException) throw valid_form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate header
  const header = await validateHeader(header_id, header_service, req);
  if (header instanceof HttpException) return header;
  //#endregion

  //#region Validate title
  let title = await valiadteTitle(title_id, title_service, req);
  if (title instanceof HttpException) return title;
  //#endregion
  //#endregion

  try {
    //#region Update title
    title.form = form;
    title.parent_ref = header.ref;
    title.name = name;

    title.updated_at = new Date();
    title.updated_by = request_code;
    //#endregion

    //#region Generate response
    title = await title_service.update(title);
    if (title) {
      return await generateTitleResponse(title, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_TITLE_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const updateItem = async (
  item_id: number,
  request_code: string,
  params: ItemDto,
  form_service: FormService,
  item_service: ItemService,
  option_service: OptionService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<ItemResponse> | HttpException> => {
  //#region Get params
  const { form_id, title_id, control, options } = params;
  //#endregion

  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form in progress or done
  const valid_form = validateEditFormInProgressOrDone(form, req);
  if (valid_form instanceof HttpException) throw valid_form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate title
  const title = await valiadteTitle(title_id, title_service, req);
  if (title instanceof HttpException) return title;
  //#endregion

  //#region Validate item
  let item = await valiadteItem(item_id, item_service, req);
  if (item instanceof HttpException) return item;
  //#endregion

  //#region Validate require option
  const valid_option = validateRequiredOption(control, options, req);
  if (valid_option instanceof HttpException) return valid_option;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Remove old options if available`
    const results = await removeItemOptions(
      item_id,
      request_code,
      option_service,
      query_runner,
      req,
    );

    if (results instanceof HttpException) throw results;
    //#endregion

    //#region Update item
    item = await generateUpdateItem(
      request_code,
      params,
      form,
      item,
      title,
      item_service,
      query_runner,
    );
    //#endregion

    if (item) {
      //#region Create options
      const options = params.options;
      if (options && options.length > 0) {
        const results = await createItemOptions(
          request_code,
          options,
          form,
          item,
          option_service,
          query_runner,
        );

        if (!results) {
          throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
        } else item.options = results;
      }
      //#endregion

      //#region Update Item relation
      item = await query_runner.manager.save(item);
      //#endregion

      //#region Generate response
      return await generateItemResponse(item, query_runner, req);
      //#endregion
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};

export const unlinkForm = async (
  form_id: number,
  request_code: string,
  form_service: FormService,
  req: Request,
): Promise<HttpResponse<FormResponse> | HttpException> => {
  //#region Validation
  //#region Validate form
  let form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion
  //#endregion

  try {
    //#region Update form
    form.deleted = true;
    form.deleted_by = request_code;
    form.deleted_at = new Date();
    //#endregion

    //#region Generate response
    form = await form_service.unlink(form);
    if (form) {
      return await generateFormResponse(form, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const unlinkHeader = async (
  form_id: number,
  header_id: number,
  request_code: string,
  form_service: FormService,
  header_service: HeaderService,
  req: Request,
) => {
  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form in progress or done
  const valid_form = validateEditFormInProgressOrDone(form, req);
  if (valid_form instanceof HttpException) throw valid_form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate header
  let header = await validateHeader(header_id, header_service, req);
  if (header instanceof HttpException) return header;
  //#endregion
  //#endregion

  try {
    //#region Update header
    header.deleted = true;
    header.deleted_by = request_code;
    header.deleted_at = new Date();
    //#endregion

    //#region Generate response
    header = await header_service.unlink(header);
    if (header) {
      return await generateHeaderResponse(header, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_HEADERS_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const unlinkTitle = async (
  form_id: number,
  title_id: number,
  request_code: string,
  form_service: FormService,
  title_service: TitleService,
  req: Request,
): Promise<HttpResponse<BaseResponse> | HttpException> => {
  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form in progress or done
  const valid_form = validateEditFormInProgressOrDone(form, req);
  if (valid_form instanceof HttpException) throw valid_form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate title
  let title = await valiadteTitle(title_id, title_service, req);
  if (title instanceof HttpException) return title;
  //#endregion
  //#endregion

  try {
    //#region Update title
    title.deleted = true;
    title.deleted_at = new Date();
    title.deleted_by = request_code;
    //#endregion

    //#region Generate response
    title = await title_service.unlink(title);
    if (title) {
      return await generateTitleResponse(title, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_TITLE_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};

export const unlinkItem = async (
  form_id: number,
  item_id: number,
  request_code: string,
  form_service: FormService,
  item_service: ItemService,
  option_service: OptionService,
  data_source: DataSource,
  req: Request,
): Promise<HttpResponse<ItemResponse> | HttpException> => {
  //#region Validation
  //#region Validate form
  const form = await validateForm(form_id, form_service, req);
  if (form instanceof HttpException) return form;
  //#endregion

  //#region Validate form in progress or done
  const valid_form = validateEditFormInProgressOrDone(form, req);
  if (valid_form instanceof HttpException) throw valid_form;
  //#endregion

  //#region Validate form status
  const valid = await validateFormPubishStatus(form, req);
  if (valid instanceof HttpException) return valid;
  //#endregion

  //#region Validate item
  let item = await valiadteItem(item_id, item_service, req);
  if (item instanceof HttpException) return item;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Remove old options if available`
    const results = await removeItemOptions(
      item_id,
      request_code,
      option_service,
      query_runner,
      req,
    );

    if (results instanceof HttpException) throw results;
    //#endregion

    //#region Update item
    item = await generateUnlinkItem(
      request_code,
      item,
      item_service,
      query_runner,
    );
    //#endregion

    if (item) {
      //#region Generate response
      return await generateItemResponse(item, query_runner, req);
      //#endregion
    } else {
      //#region throw HandlerException
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
      //#endregion
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};

export const cloneForm = async (
  form_id: number,
  request_code: string,
  form_service: FormService,
  header_service: HeaderService,
  item_service: ItemService,
  option_service: OptionService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Validation
  //#region Validate form
  const source_form = await validateFormExist(form_id, form_service, req);
  if (source_form instanceof HttpException) return source_form;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Create form
    let target_form = new FormEntity();
    target_form.academic_year = source_form.academic_year;
    target_form.semester = source_form.semester;
    target_form.start = source_form.start;
    target_form.end = source_form.end;
    target_form.status = FormStatus.DRAFTED;

    target_form.created_by = request_code;
    target_form.created_at = new Date();
    //#endregion

    //#region Generate response
    target_form = await form_service.add(target_form);
    if (target_form) {
      //#region Clone headers
      let success = await header_service.cloneHeaders(
        source_form.id,
        target_form.id,
        query_runner.manager,
      );

      //#region throw HandlerException
      if (!success) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.OPERATOR_HEADERS_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Clone titles
      success = await title_service.cloneTitles(
        source_form.id,
        target_form.id,
        query_runner.manager,
      );

      //#region throw HandlerException
      if (!success) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.OPERATOR_TITLE_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Clone items
      success = await item_service.cloneItems(
        source_form.id,
        target_form.id,
        query_runner.manager,
      );

      //#region throw HandlerException
      if (!success) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.OPERATOR_ITEM_ERROR,
        );
      }
      //#endregion
      //#endregion

      //#region Clone options
      success = await option_service.cloneOptions(
        source_form.id,
        target_form.id,
        query_runner.manager,
      );

      //#region throw HandlerException
      if (!success) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.OPERATOR_OPTION_ERROR,
        );
      }
      //#endregion
      //#endregion

      return await generateFormResponse(target_form, query_runner, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
    }
    //#endregion
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

export const generateCreateItem = async (
  request_code: string,
  params: ItemDto,
  form: FormEntity,
  title: TitleEntity,
  item_serviec: ItemService,
  query_runner: QueryRunner,
) => {
  //#region Get params
  const {
    content,
    control,
    is_file,
    unit,
    category,
    from_mark,
    required,
    to_mark,
    mark,
    sort_order,
  } = params;
  //#endregion

  let item = new ItemEntity();
  item.form = form;
  item.parent_ref = title.ref;
  item.ref = randomUUID();
  item.control = control;
  item.multiple = false;
  item.content = content;
  item.from_mark = from_mark;
  item.to_mark = to_mark;
  item.mark = mark;
  item.category = category;
  item.unit = unit;
  item.required = required;
  item.is_file = is_file;
  item.sort_order = sort_order;

  item.created_at = new Date();
  item.created_by = request_code;

  item = await item_serviec.add(item, query_runner.manager);
  return item;
};

export const generateUpdateItem = async (
  request_code: string,
  params: ItemDto,
  form: FormEntity,
  item: ItemEntity,
  title: TitleEntity,
  item_service: ItemService,
  query_runner: QueryRunner,
) => {
  //#region Get params
  const {
    content,
    control,
    is_file,
    unit,
    category,
    from_mark,
    required,
    to_mark,
    mark,
    sort_order,
  } = params;
  //#endregion

  item.form = form;
  item.parent_ref = title.ref;
  item.control = control;
  item.multiple = false;
  item.content = content;
  item.from_mark = from_mark;
  item.to_mark = to_mark;
  item.mark = mark;
  item.category = category;
  item.unit = unit;
  item.required = required;
  item.is_file = is_file;
  item.sort_order = sort_order;

  item.updated_at = new Date();
  item.updated_by = request_code;

  item = await item_service.update(item, query_runner.manager);
  return item;
};

export const generateUnlinkItem = async (
  request_code: string,
  item: ItemEntity,
  item_service: ItemService,
  query_runner: QueryRunner,
) => {
  item.deleted = true;
  item.deleted_at = new Date();
  item.deleted_by = request_code;

  item = await item_service.unlink(item, query_runner.manager);
  return item;
};

export const createItemOptions = async (
  request_code: string,
  options: OptionDto[],
  form: FormEntity,
  item: ItemEntity,
  option_service: OptionService,
  query_runner: QueryRunner,
) => {
  let item_options: OptionEntity[] = [];

  for await (const i of options) {
    const option = new OptionEntity();
    option.form = form;
    option.parent_ref = item.ref;
    option.content = i.content;
    option.mark = i.mark;
    option.created_at = new Date();
    option.created_by = request_code;
    item_options.push(option);
  }

  //#region Create options
  item_options = await option_service.bulkAdd(
    item_options,
    query_runner.manager,
  );
  //#endregion

  return item_options;
};

export const removeItemOptions = async (
  item_id: number,
  request_code: string,
  option_service: OptionService,
  query_runner: QueryRunner,
  req: Request,
): Promise<HttpException | null> => {
  //#region Get options by item_id
  const options = await option_service.getOptionsByItemId(item_id);
  //#endregion

  if (options && options.length > 0) {
    //#region Delete options
    const success = await option_service.bulkUnlink(
      item_id,
      request_code,
      query_runner.manager,
    );

    if (!success) {
      return generateFailedResponse(req, ErrorMessage.OPERATOR_ITEM_ERROR);
    }
    //#endregion
  }

  return null;
};

export const setFormStatus = async (
  request_code: string,
  status: FormStatus,
  form: FormEntity,
  form_service: FormService,
  req: Request,
): Promise<HttpResponse<FormResponse> | HttpException> => {
  try {
    //#region Update form
    form.status = status;
    form.updated_by = request_code;
    form.updated_at = new Date();
    //#endregion

    //#region Generate response
    form = await form_service.update(form);
    if (form) {
      return await generateFormResponse(form, null, req);
    } else {
      throw generateFailedResponse(req, ErrorMessage.OPERATOR_FORM_ERROR);
    }
    //#endregion
  } catch (err) {
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
  }
};
