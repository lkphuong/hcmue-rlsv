import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import * as xlsx from 'xlsx';
import * as path from 'path';

import { removeDuplicates } from '../../../utils';

import {
  validateAcademic,
  validateFile,
  validateSemester,
} from '../validations';

import { ImportUsersDto } from '../dtos/import_users.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { FilesService } from '../../file/services/files.service';
import { SemesterService } from '../../semester/services/semester.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { ExcelDataResponse } from '../interfaces/users-response.interface';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateImportUsers = async (
  params: ImportUsersDto,
  root: string,
  academic_year_serivce: AcademicYearService,
  file_service: FilesService,
  semester_service: SemesterService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Get params
  const { academic_id, file_id, semester_id } = params;
  //#endregion

  //#region Validation
  //#region Validate academic
  const academic = await validateAcademic(
    academic_id,
    academic_year_serivce,
    req,
  );
  if (academic instanceof HttpException) throw academic;
  //#endregion

  //#region Validate file
  const file = await validateFile(file_id, file_service, req);
  if (file instanceof HttpException) throw file;
  //#endregion

  //#region Validate semester
  const semester = await validateSemester(semester_id, semester_service, req);
  if (semester instanceof HttpException) throw semester;
  //#endregion
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region read file
    const data = await readDataFromFile(path.join(root, file.fileName));
    console.log(data);
    //#endregion

    //#region query database

    //#endregion
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

export const readDataFromFile = async (path: string) => {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  let statuses = [];
  let academics = [];
  let departments = [];
  let majors = [];
  let classes = [];

  for (const z in worksheet) {
    if (z.toString()[0] === 'B') {
      statuses.push(worksheet[z].v);
    }
    if (z.toString()[0] === 'E') {
      academics.push(worksheet[z].v);
    }
    if (z.toString()[0] === 'F') {
      departments.push(worksheet[z].v);
    }
    if (z.toString()[0] === 'G') {
      majors.push(worksheet[z].v);
    }
    if (z.toString()[0] === 'H') {
      classes.push(worksheet[z].v);
    }
  }

  //#region remove duplicate
  academics = removeDuplicates(academics);
  classes = removeDuplicates(classes);
  departments = removeDuplicates(departments);
  majors = removeDuplicates(majors);
  statuses = removeDuplicates(statuses);
  //#endregion

  const result: ExcelDataResponse = {
    academics: academics,
    departmentes: departments,
    majors: majors,
    classes: classes,
    statuses: statuses,
  };

  return result;
};
