import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, InsertResult, QueryRunner } from 'typeorm';

import { EventEmitter2 } from '@nestjs/event-emitter';

import * as xlsx from 'xlsx';
import * as path from 'path';
import * as md5 from 'md5';

import {
  removeDuplicates,
  removeDuplicatesObject,
  sprintf,
} from '../../../utils';
import {
  arrayDifference,
  arrayDuplicate,
  arrayObjectDifference,
  generateImportSuccessResponse,
} from '../utils';
import { generateBaseResponse, generateClassResponse } from '../transforms';

import { MajorEntity } from '../../../entities/major.entity';
import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { KEntity } from '../../../entities/k.entity';
import { StatusEntity } from '../../../entities/status.entity';
import { UserEntity } from '../../../entities/user.entity';

import {
  validateAcademic,
  validateFile,
  validateSemester,
  validateTime,
} from '../validations';

import { ImportUsersDto } from '../dtos/import_users.dto';

//#region import service
import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { FilesService } from '../../file/services/files.service';
import { FormService } from '../../form/services/form.service';
import { KService } from '../../k/services/k.service';
import { MajorService } from '../../major/services/major.service';
import { SemesterService } from '../../semester/services/semester.service';
import { StatusService } from '../../status/services/status.service';
import { UserService } from '../services/user.service';
//#endregion

import { HandlerException } from '../../../exceptions/HandlerException';

//#region import interface
import { ClassResponse } from '../../class/interfaces/class_response.interface';
import { DepartmentResponse } from '../../department/interfaces/department_response.interface';
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
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { EventKey } from '../../shared/constants/event-key.enum';

export const generateImportUsers = async (
  params: ImportUsersDto,
  root: string,
  academic_year_serivce: AcademicYearService,
  class_service: ClassService,
  department_service: DepartmentService,
  file_service: FilesService,
  form_service: FormService,
  k_service: KService,
  major_service: MajorService,
  semester_service: SemesterService,
  status_service: StatusService,
  user_service: UserService,
  data_source: DataSource,
  event_emitter: EventEmitter2,
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

  //#region Validate time
  const form = await validateTime(form_service, req);
  if (form instanceof HttpException) throw form;
  //#endregion
  //#endregion

  //#region Get User
  const user = await user_service.getOneUser();
  let result: InsertResult | null = null;
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Get data
    const data_query = await generateData(
      class_service,
      department_service,
      k_service,
      major_service,
      status_service,
    );

    //#endregion

    //#region read file
    const data = await readDataFromFile(path.join(root, file.fileName));
    //#endregion

    //#region check duplicate std_code
    const duplicate_std_codes = await arrayDuplicate(data.std_codes);
    if (duplicate_std_codes.length > 0) {
      throw new HandlerException(
        VALIDATION_EXIT_CODE.UNIQUE_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.IMPORT_DUPLICATE_ERROR, duplicate_std_codes),
        HttpStatus.BAD_REQUEST,
      );
    }
    //#endregion

    //#region compare two array
    //#region comapre class
    const class_difference = arrayObjectDifference(
      data_query.classes,
      data.classes,
      'code',
    );
    //#endregion

    //#region compare department
    const array_department =
      data_query.departments && data_query.departments.length > 0
        ? data_query.departments.map((i) => {
            return i.name;
          })
        : [];
    const department_difference = arrayDifference(
      array_department,
      data.departments,
    );
    //#endregion

    //#region compare status
    const array_status =
      data_query.statuses && data_query.statuses.length > 0
        ? data_query.statuses.map((i) => {
            return i.name;
          })
        : [];
    const status_difference = arrayDifference(array_status, data.statuses);
    //#endregion

    //#region compare k
    const array_k =
      data_query.k && data_query.k.length > 0
        ? data_query.k.map((i) => {
            return i.name;
          })
        : [];
    const k_difference = arrayDifference(array_k, data.k);
    //#endregion

    //#region compare major
    const major_difference = arrayObjectDifference(
      data_query.majors,
      data.majors,
      'name',
    );
    //#endregion

    //#endregion

    //#region Create status
    let new_cache_status: StatusResponse[] = [...data_query.statuses];
    if (status_difference) {
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
        new_cache_status = [...new_cache_status, ...result];
        //#endregion
      }
    }

    //#endregion
    //#region Create department
    let new_cache_department: DepartmentResponse[] = [
      ...data_query.departments,
    ];
    if (department_difference && department_difference.length > 0) {
      const new_department = await generateCreateDepartment(
        department_difference,
        department_service,
        query_runner,
      );
      if (!new_department) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.DEPARTMENT_OPERATOR_ERROR,
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        //#region transform data and new cache
        const result = generateBaseResponse(new_department);
        new_cache_department = [...new_cache_department, ...result];
        //#endregion
      }
    }

    //#endregion

    //#region Create major
    let new_cache_major: MajorResponse[] = [...data_query.majors];
    if (major_difference && major_difference.length > 0) {
      const new_major = await generateCreateMajor(
        major_difference,
        new_cache_department,
        major_service,
        query_runner,
      );
      if (!new_major) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.MAJOR_OPERATOR_ERROR,
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        //#region transform data and new cache
        const result = generateBaseResponse(new_major);
        new_cache_major = [...new_cache_major, ...result];
        //#endregion
      }
    }

    //#endregion

    //#region Create k
    let new_cache_k: KResponse[] = [...data_query.k];
    if (k_difference && k_difference.length > 0) {
      const new_k = await generateCreateK(
        k_difference,
        k_service,
        query_runner,
      );
      if (!new_k) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.K_OPERATOR_ERROR,
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        //#region transform data and new cache
        const result = generateBaseResponse(new_k);
        new_cache_k = [...new_cache_k, ...result];
        //#endregion
      }
    }

    //#endregion

    //#region Create class
    let new_cache_class: ClassResponse[] = [...data_query.classes];
    if (class_difference && class_difference.length > 0) {
      const new_class = await generateCreateClass(
        class_difference,
        new_cache_department,
        new_cache_k,
        class_service,
        query_runner,
      );
      if (!new_class) {
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.CLASS_OPERATOR_ERROR,
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        //#region transform data and new cache
        const result = generateClassResponse(new_class);
        new_cache_class = [...new_cache_class, ...result];
        //#endregion
      }
    }
    //#endregion

    //#region Update old users
    const count = await user_service.count(academic_id, semester_id);
    if (count > 0) {
      await user_service.bulkUnlink(query_runner.manager);
    }

    //#endregion

    //#region Create user
    result = await generateCreateUser(
      path.join(root, file.fileName),
      academic_id,
      semester_id,
      new_cache_class,
      new_cache_status,
      new_cache_department,
      new_cache_major,
      user_service,
      query_runner,
    );

    if (!result) {
      throw new HandlerException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
        ErrorMessage.STUDENT_OPERATOR_ERROR,
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    //#endregion
    //#region

    //#region response
    return await generateImportSuccessResponse(query_runner, req);
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

    //#region Emit generate update password
    if (user && result) {
      event_emitter.emit(
        EventKey.HCMUE_GENERATE_USER_UPDATE_PASSWORD,
        user.academic_id,
        user.semester_id,
        academic_id,
        semester_id,
      );
    }
    //#endregion
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
  const std_codes = [];
  for (let i = 1; i < range; i++) {
    if (data[i][1]) {
      statuses.push(data[i][1]);
    }
    if (data[i][0]) {
      std_codes.push(data[i][0]);
    }
    if (data[i][5]) {
      k.push(data[i][5]);
    }
    if (data[i][6]) {
      departments.push(data[i][6]);
    }

    if (data[i][7]) {
      majors.push({
        name: data[i][7],
        department: data[i][6],
      });
    }

    if (data[i][8] && data[i][9]) {
      classes.push({
        code: data[i][8],
        name: data[i][9],
        department: data[i][6],
        k: data[i][5],
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
    departments: departments,
    majors: majors,
    classes: classes,
    statuses: statuses,
    std_codes: std_codes,
  };

  return result;
};

export const generateData = async (
  class_service: ClassService,
  department_service: DepartmentService,
  k_service: KService,
  major_service: MajorService,
  status_service: StatusService,
) => {
  const [$class, departments, k, majors, statuses] = await Promise.all([
    class_service.getClasses(),
    department_service.getDepartments(),
    k_service.getAll(),
    major_service.getMajors(),
    status_service.getStatuses(),
  ]);

  return {
    classes: $class,
    statuses: statuses,
    departments: departments,
    k: k,
    majors: majors,
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
  ks: KResponse[],
  class_service: ClassService,
  query_runner: QueryRunner,
) => {
  const add_class: ClassEntity[] = [];
  for (const i of data) {
    const $class = new ClassEntity();
    $class.code = i.code;
    $class.name = i.name;
    $class.department_id = departments.find(
      (department) => department.name == i.department,
    ).id;
    $class.k = ks.find((k) => k.name == i.k).id;
    add_class.push($class);
  }

  //#region Add classes
  const results = await class_service.bulkAdd(add_class, query_runner.manager);

  return results || null;
  //#endregion
};

export const generateCreateUser = async (
  path: string,
  academic_id: number,
  semester_id: number,
  classes: ClassResponse[],
  statuses: StatusResponse[],
  departments: DepartmentResponse[],
  majors: MajorResponse[],
  user_service: UserService,
  query_runner: QueryRunner,
) => {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

  //#region loop file excel
  let add_users: UserEntity[] = [];
  let counter = 0;
  for await (const i of data) {
    const item = new UserEntity();
    item.academic_id = academic_id;
    item.semester_id = semester_id;
    item.std_code = i[0];
    item.email = i[4];
    item.status_id = i[1]
      ? statuses.find((status) => status.name == i[1]).id
      : null;
    item.fullname = i[2];
    item.password = md5(i[3]);
    item.birthday = i[3];
    item.class_id = i[8]
      ? classes.find(($class) => $class.code == i[8]).id
      : null;
    item.department_id = i[6]
      ? departments.find((department) => department.name == i[6]).id
      : null;
    item.major_id = i[7] ? majors.find((major) => major.name == i[7]).id : null;
    item.avatar = i[10] ?? null;
    add_users.push(item);
    counter++;
    if (counter % 1000 === 0) {
      const result = await user_service.bulkAdd(
        add_users,
        query_runner.manager,
      );
      if (!result) return null;
      add_users = [];
    }
  }
  //#endregion

  //#region Add user
  const result = await user_service.bulkAdd(add_users, query_runner.manager);
  return result || null;
  //#endregion
};
