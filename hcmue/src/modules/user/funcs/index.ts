import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, QueryRunner } from 'typeorm';
import * as xlsx from 'xlsx';
import * as path from 'path';
import { Cache } from 'cache-manager';

import { removeDuplicates, removeDuplicatesObject } from '../../../utils';
import { arrayDifference, arrayObjectDifference } from '../utils';

import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { KEntity } from '../../../entities/k.entity';
import { MajorEntity } from '../../../entities/major.entity';

import {
  validateAcademic,
  validateFile,
  validateSemester,
} from '../validations';

import { ImportUsersDto } from '../dtos/import_users.dto';

//#region import service
import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { FilesService } from '../../file/services/files.service';
import { KService } from '../../k/services/k.service';
import { MajorService } from '../../major/services/major.service';
import { RoleUsersService } from '../../role/services/role_users/role_users.service';
import { SemesterService } from '../../semester/services/semester.service';
import { StatusService } from '../../status/status/status.service';
import { UserService } from '../services/user.service';
//#endregion

import { HandlerException } from '../../../exceptions/HandlerException';

//#region import interface
import { ClassResponse } from '../../class/interfaces/class_response.interface';
import { DepartmentResponse } from '../../department/interfaces/department_response';
import {
  ExcelClassResponse,
  ExcelDataResponse,
  ExcelMajorResponse,
} from '../interfaces/users-response.interface';
import { KResponse } from '../../k/interfaces/k_response.interface';
import { MajorResponse } from '../../major/interfaces/major_response.interface';
import { StatusResponse } from '../../status/interfaces/status_response.interface';
//#endregion

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { CACHE_KEY } from '../constants/enums/cache_key.enum';
import { StatusEntity } from 'src/entities/status.entity';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { generateBaseResponse } from '../transforms';

export const generateImportUsers = async (
  params: ImportUsersDto,
  root: string,
  academic_year_serivce: AcademicYearService,
  class_service: ClassService,
  department_service: DepartmentService,
  file_service: FilesService,
  k_service: KService,
  major_service: MajorService,
  semester_service: SemesterService,
  status_service: StatusService,
  cache_manager: Cache,
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

    //#region Get Cache
    const cache = await readDataFromCache(cache_manager);
    //#endregion

    //#region read file
    const data = await readDataFromFile(path.join(root, file.fileName));
    //#endregion

    //#region compare two array
    //#region comapre class
    const class_difference = arrayObjectDifference(
      cache.classes,
      data.classes,
      'code',
    );
    //#endregion

    //#region compare department
    const array_department = cache.departments.map((i) => {
      return i.name;
    });
    const department_difference = arrayDifference(
      array_department,
      data.departmentes,
    );
    //#endregion

    //#region compare status
    const array_status = cache.statuses.map((i) => {
      return i.name;
    });
    const status_difference = arrayDifference(array_status, data.statuses);
    //#endregion

    //#region compare k
    const array_k = cache.k.map((i) => {
      return i.name;
    });
    const k_difference = arrayDifference(array_k, data.k);
    //#endregion

    //#region compare major
    const major_difference = arrayObjectDifference(
      cache.majors,
      data.majors,
      'name',
    );
    //#endregion

    //#endregion

    //#region Add new data

    //#region Create status
    const new_status = await generateCreateStatus(
      status_difference,
      status_service,
      query_runner,
    );
    if (!new_status) {
      throw new HandlerException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
        ErrorMessage.STATUS_OPERATOR_ERROR,
        HttpStatus.EXPECTATION_FAILED,
      );
    } else {
      //#region transform data and new cache
      const result = generateBaseResponse(new_status);
      const new_cache = [...cache.statuses, ...result];
      await cache_manager.set(CACHE_KEY.STATUS, new_cache, 0);
      //#endregion
    }
    //#endregion

    //#region
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
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const range = data.length;

  let statuses = [];
  let k = [];
  let departments = [];
  let majors: ExcelMajorResponse[] = [];
  let classes: ExcelClassResponse[] = [];
  for (let i = 1; i < range; i++) {
    if (data[i][1]) {
      statuses.push(data[i][1]);
    }
    if (data[i][4]) {
      k.push(data[i][4]);
    }
    if (data[i][5]) {
      departments.push(data[i][5]);
    }

    if (data[i][6]) {
      majors.push({
        name: data[i][6],
        department: data[i][5],
      });
    }

    if (data[i][7] && data[i][8]) {
      classes.push({
        code: data[i][7],
        name: data[i][8],
        department: data[i][5],
      });
    }
  }

  //#region remove duplicate
  k = removeDuplicates(k);
  classes = removeDuplicatesObject(classes, 'code');
  departments = removeDuplicates(departments);
  majors = removeDuplicatesObject(majors, 'name');
  statuses = removeDuplicates(statuses);
  //#endregion

  const result: ExcelDataResponse = {
    k: k,
    departmentes: departments,
    majors: majors,
    classes: classes,
    statuses: statuses,
  };

  return result;
};

export const readDataFromCache = async (cache_manager: Cache) => {
  const $class = (await cache_manager.get(CACHE_KEY.CLASS)) as ClassResponse[];
  const statuses = (await cache_manager.get(
    CACHE_KEY.STATUS,
  )) as StatusResponse[];

  const departments = (await cache_manager.get(
    CACHE_KEY.DEPARTMENT,
  )) as DepartmentResponse[];
  const k = (await cache_manager.get(CACHE_KEY.K)) as KResponse[];
  const majors = (await cache_manager.get(CACHE_KEY.MAJOR)) as MajorResponse[];

  return {
    classes: $class,
    statuses: statuses,
    departments: departments,
    k: k,
    majors,
  };
};

export const generateCreateK = async (
  data: string[],
  k_service: KService,
  query_runner: QueryRunner,
) => {
  const add_k: KEntity[] = [];
  for (const i of data) {
    const k = new KEntity();
    k.name = i;
    k.active = true;
    k.created_at = new Date();
    k.deleted = false;

    add_k.push(k);
  }

  //#region Add k
  const results = await k_service.bulkAdd(add_k, query_runner.manager);
  return results || null;
  //#endregion
};

export const generateCreateDepartment = async (
  data: string[],
  department_service: DepartmentService,
  query_runner: QueryRunner,
) => {
  const add_department: DepartmentEntity[] = [];

  for (const i of data) {
    const department = new DepartmentEntity();
    department.name = i;
    department.active = true;
    department.created_at = new Date();
    department.deleted = false;

    add_department.push(department);
  }

  //#region Add department
  const results = await department_service.bulkAdd(
    add_department,
    query_runner.manager,
  );
  //#endregion

  return results || null;
};

export const generateCreateMajor = async (
  data: ExcelMajorResponse[],
  departments: DepartmentResponse[],
  major_service: MajorService,
  query_runner: QueryRunner,
) => {
  const add_majors: MajorEntity[] = [];

  for await (const i of data) {
    const major = new MajorEntity();
    major.name = i.name;
    major.department_id = departments.find(
      (department) => department.name == i.department,
    ).id;
    major.active = true;
    major.created_at = new Date();
    major.deleted = false;

    add_majors.push(major);
  }

  //#region Add major
  const results = await major_service.bulkAdd(add_majors, query_runner.manager);

  return results || null;
  //#endregion
};

export const generateCreateStatus = async (
  data: string[],
  status_service: StatusService,
  query_runner: QueryRunner,
) => {
  const add_status: StatusEntity[] = [];

  for (const i of data) {
    const status = new StatusEntity();
    status.name = i;
    status.active = true;
    status.created_at = new Date();
    status.deleted = false;

    add_status.push(status);
  }

  //#region Add status
  const results = await status_service.bulkAdd(
    add_status,
    query_runner.manager,
  );

  return results || null;
  //#endregion
};

export const generateCreateClass = async (
  data: ExcelClassResponse[],
  departments: DepartmentResponse[],
  class_service: ClassService,
  query_runner: QueryRunner,
) => {
  const add_class: ClassEntity[] = [];
  for (const i of data) {
    const $class = new ClassEntity();
    $class.code = i.code;
    $class.name = i.name;
    $class.department_id = departments.find(
      (department) => (department.name = i.department),
    ).id;

    add_class.push($class);
  }

  //#region Add classes
  const results = await class_service.bulkAdd(add_class, query_runner.manager);

  return results || null;
  //#endregion
};
