import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { FormEntity } from 'src/entities/form.entity';

import { HandlerException } from 'src/exceptions/HandlerException';

import { HeaderService } from 'src/modules/header/services/header.service';
import { TitleService } from 'src/modules/title/services/title.service';
import { AcademicYearService } from 'src/modules/academic-year/services/academic_year.service';
import { FormmService } from '../service/service.service';
import { SemesterService } from 'src/modules/semester/services/semester.service';

import { CreateFormDto } from '../dtos/add_form.dto';
import { CreateTitleDto } from '../dtos/add_title.dto';
import {
  generateDataCreateForm2Object,
  generateDataTitle2Object,
  generateFailedResponse,
} from '../utils';
import {
  validateAcademicYear,
  validateHeader,
  validateSemester,
  validateTime,
} from '../validations';
import { ErrorMessage } from '../constants/errors.enum';
import { SERVER_EXIT_CODE } from 'src/constants/enums/error-code.enum';
import { TitleEntity } from 'src/entities/title.entity';

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

export const createTile = async (
  user_id: string,
  param: CreateTitleDto,
  header_service: HeaderService,
  title_service: TitleService,
  data_source: DataSource,
  req: Request,
) => {
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

    const title = new TitleEntity();
    title.header = header;
    title.name = name;
    title.created_at = new Date();
    title.created_by = user_id;

    const result = await query_runner.manager.save(title);

    return await generateDataTitle2Object(title, query_runner, req);
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
