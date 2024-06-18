import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, QueryRunner } from 'typeorm';

import { EventEmitter2 } from '@nestjs/event-emitter';

import * as xlsx from 'xlsx';
import * as path from 'path';
import * as md5 from 'md5';

import {
  generateFailedResponse,
  generateImportSuccessResponse,
} from '../utils';

import { validateAcademic, validateFile } from '../validations';

import { AdviserClassesEntity } from '../../../entities/adviser_classes.entity';
import { AdviserEntity } from '../../../entities/adviser.entity';
import { RoleEntity } from '../../../entities/role.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { AdviserClassesService } from '../services/adviser-classes/adviser_classes.service';
import { AdviserService } from '../services/adviser/adviser.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { FilesService } from '../../file/services/files.service';
import { RoleService } from '../../role/services/role/role.service';
import { RoleUsersService } from '../../role/services/role_users/role_users.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { ImportAdviserDto } from '../dtos/import.dto';

import {
  ExcelAdviserClassResponse,
  ExcelAdviserResponse,
  ExcelDataResponse,
} from '../interfaces/adviser-response.interface';
import { DepartmentResponse } from '../../department/interfaces/department_response.interface';
import { ClassResponse } from '../../class/interfaces/class_response.interface';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { EventKey } from '../../shared/constants/event-key.enum';

export const generateImportAdviser = async (
  params: ImportAdviserDto,
  root: string,
  academic_year_serivce: AcademicYearService,
  adviser_classes_service: AdviserClassesService,
  adviser_service: AdviserService,
  class_service: ClassService,
  department_service: DepartmentService,
  file_service: FilesService,
  role_service: RoleService,
  role_user_service: RoleUsersService,
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
  //#endregion

  //#region Get academic old
  const adviser = await adviser_service.getOneAdviser();
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Get data
    const data_query = await generateData(class_service, department_service);
    //#endregion

    //#region read file excel
    const data = await readDataFromFile(path.join(root, file.fileName));
    //#endregion

    if (data.advisers.length === 0 || data.classes.length === 0) {
      throw generateFailedResponse(req, ErrorMessage.FILE_EXCEL_NO_CONTENT);
    }

    //#region Get role adviser
    const role_adviser = await role_service.getRoleByCode(RoleCode.ADVISER);
    //#endregion

    if (role_adviser) {
      //#region Update old data
      await Promise.all([
        adviser_service.bulkUnlink(academic_id, query_runner.manager),
        adviser_classes_service.bulkUnlink(query_runner.manager),
        role_user_service.bulkUpdateByRole(
          role_adviser.id,
          query_runner.manager,
        ),
      ]);
      //#endregion

      //#region Create Adviser
      const advisers = await generateCreateAdviser(
        academic_id,
        semester_id,
        data.advisers,
        data_query.departments,
        adviser_service,
        query_runner,
      );

      if (advisers && advisers.length > 0) {
        const adviser_classes = await generateCreateAdviserClasses(
          academic_id,
          data.classes,
          data_query.classes,
          advisers,
          adviser_classes_service,
          query_runner,
        );

        if (adviser_classes) {
          const role_users = await generateCreateroleUser(
            role_adviser,
            data.advisers,
            role_user_service,
            query_runner,
          );
          if (role_users) {
            //#region response
            return await generateImportSuccessResponse(query_runner, req);
            //#endregions
          }
        }
      }
      //#endregion
      throw new HandlerException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
        ErrorMessage.ADVISER_OPERATOR_ERROR,
        HttpStatus.EXPECTATION_FAILED,
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

    //#region Emit generate update password
    if (adviser) {
      event_emitter.emit(
        EventKey.HCMUE_GENERATE_ADVISER_UPDATE_PASSWORD,
        adviser.academic_id,
        academic_id,
      );
    }
    //#endregion
  }
};

export const generateData = async (
  class_service: ClassService,
  department_service: DepartmentService,
) => {
  const $class = await class_service.getClasses();
  const departments = await department_service.getDepartments();

  return {
    classes: $class,
    departments: departments,
  };
};

export const readDataFromFile = async (path: string) => {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 8 });
  const range = data.length;

  const classes: ExcelAdviserClassResponse[] = [];
  const advisers: ExcelAdviserResponse[] = [];

  for (let i = 0; i < range; i++) {
    if (data[i][4] && data[i][5]) {
      advisers.push({
        last_name: data[i][1],
        first_name: data[i][2],
        code: data[i][3],
        phone_number: data[i][5],
        email: data[i][4],
        department: data[i][6],
        class: data[i][7],
        degree: null,
      });
    }

    if (data[i][7]) {
      classes.push({
        class: data[i][7].split('\r\n'),
        email: data[i][4],
      });
    }
  }

  const result: ExcelDataResponse = {
    advisers: advisers,
    classes: classes,
  };

  return result;
};

export const generateCreateAdviser = async (
  academic_id: number,
  semester_id: number,
  data: ExcelAdviserResponse[],
  departments: DepartmentResponse[],
  adviser_service: AdviserService,
  query_runner: QueryRunner,
) => {
  const advisers: AdviserEntity[] = [];
  for await (const i of data) {
    const item = new AdviserEntity();
    item.academic_id = academic_id;
    item.semester_id = semester_id;
    item.email = i.email;
    item.code = i.code;
    item.degree = i.degree;
    item.password = md5(i.email);
    item.fullname = i.last_name + ' ' + i.first_name;
    item.phone_number = i.phone_number;
    item.department_id =
      departments.find((department) => department.name == i.department.trim())
        ?.id ?? null;
    item.active = true;

    advisers.push(item);
  }

  //#region Add adviser
  const results = await adviser_service.bulkAdd(advisers, query_runner.manager);
  return results || null;
  //#endregion
};

export const generateCreateAdviserClasses = async (
  academic_id: number,
  data: ExcelAdviserClassResponse[],
  classes: ClassResponse[],
  advisers: AdviserEntity[],
  adviser_classes_service: AdviserClassesService,
  query_runner: QueryRunner,
) => {
  const adviser_classes: AdviserClassesEntity[] = [];
  for await (const i of advisers) {
    const adviser = data.find((e) => e.email == i.email) ?? null;
    if (adviser) {
      for await (const j of adviser.class) {
        const item = new AdviserClassesEntity();
        item.academic_id = academic_id;
        item.adviser_id = i.id;
        item.class_id = classes.find((e) => e.code == j.trim())?.id ?? null;
        adviser_classes.push(item);
      }
    }
  }
  //#region Add adviser classes
  const results = await adviser_classes_service.bulkAdd(
    adviser_classes,
    query_runner.manager,
  );

  return results || null;
  //#endregion
};

export const generateCreateroleUser = async (
  role: RoleEntity,
  data: ExcelAdviserResponse[],
  role_user_service: RoleUsersService,
  query_runner: QueryRunner,
) => {
  const role_users: RoleUsersEntity[] = [];
  for await (const i of data) {
    const item = new RoleUsersEntity();
    item.std_code = i.email;
    item.role = role;

    role_users.push(item);
  }

  //#region Add role users
  const results = await role_user_service.bulkAdd(
    role_users,
    query_runner.manager,
  );

  return results || null;
  //#endregion
};
