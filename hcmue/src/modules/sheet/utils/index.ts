import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { returnObjects, returnObjectsWithPaging } from '../../../utils';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { SemesterService } from '../../semester/services/semester.service';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { FilesService } from '../../file/services/files.service';
import { FormEntity } from '../../../entities/form.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SemesterEntity } from '../../../entities/semester.entity';
import { SheetEntity } from '../../../entities/sheet.entity';
import { SheetService } from '../services/sheet.service';
import { UserEntity } from '../../../entities/user.entity';

import { GetClassStatusAdviserHistoryDto } from '../dtos/get_classes_status_adviser_history.dto';

import {
  ApproveAllResponse,
  BaseResponse,
  ClassResponse,
  ClassSheetsResponse,
  ClassStatusResponse,
  ManagerDepartmentResponse,
  UserSheetsResponse,
} from '../interfaces/sheet_response.interface';

import {
  generateAdminSheets,
  generateClasses2Array,
  generateClassSheets,
  generateClassStatusAdviser,
  generateClassStatusAdviserHistory,
  generateClassStatusDepartment,
  generateData2Object,
  generateDepartStatus,
  generateEvaluationsArray,
  generateItemsArray,
  generateUserSheets,
} from '../transform/index';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { EvaluationCategory } from '../constants/enums/evaluation_catogory.enum';
import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

export const generateClassesResponse = async (
  data: ClassEntity[] | null,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const classes = await generateClasses2Array(data);

  // Returns object
  return returnObjects<BaseResponse>(classes);
};

export const generateUserSheetsResponse = (
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to UserSheetsResponse
  const payload = generateUserSheets(sheets);

  // Returns data
  return returnObjects(payload);
};

export const generateUserSheetsPagingResponse = (
  pages: number,
  page: number,
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to UserSheetsResponse
  const payload = generateUserSheets(sheets);

  return returnObjectsWithPaging<UserSheetsResponse>(pages, page, payload);
};

export const generateClassSheetsResponse = async (
  sheets: SheetEntity[],
  users: UserEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity to ClassSheetsResponse
  const payload = await generateClassSheets(sheets);

  // Returns data
  return returnObjects(payload);
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_SHEET_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};

export const generateSuccessResponse = async (
  sheet: SheetEntity,
  role: number,
  sheet_service: SheetService,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to SheetResponse class
  const payload = await generateData2Object(sheet, role);

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateApproveAllResponse = (
  sheet_ids: number[],
  success: boolean,
) => {
  const payload: ApproveAllResponse = {
    sheet_ids: sheet_ids,
    success: success,
  };

  return returnObjects<ApproveAllResponse>(payload);
};

export const generateSheet = async (
  sheet: SheetEntity,
  role: number,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateData2Object(sheet, role);

  return returnObjects(payload);
};

export const generateItemsResponse = async (
  role: number,
  items: ItemEntity[],
  base_url: string,
  file_service: FilesService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateItemsArray(role, items, base_url, file_service);

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateEvaluationsResponse = async (
  role: number,
  evaluations: EvaluationEntity[],
  sheet: SheetEntity,
  base_url: string,
  file_service: FilesService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateEvaluationsArray(
    role,
    evaluations,
    sheet,
    base_url,
    file_service,
  );

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateClassStatusAdviserResponse = async (
  role: number,
  form: FormEntity,
  $class: ClassEntity[],
  sheet_service: SheetService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateClassStatusAdviser(
    role,
    $class,
    form,
    sheet_service,
  );

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateClassStatusAdviserHistoryResponse = async (
  role: number,
  pages: number,
  page: number,
  params: GetClassStatusAdviserHistoryDto,
  forms: FormEntity[],
  $class: ClassEntity,
  sheet_service: SheetService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateClassStatusAdviserHistory(
    role,
    params,
    $class,
    forms,
    sheet_service,
  );

  // Returns objects
  return returnObjectsWithPaging<ClassResponse>(pages, page, payload);
};

export const generateClassStatusDepartmentResponse = async (
  pages: number,
  page: number,
  academic_id: number,
  semester_id: number,
  department_id: number,
  classes: ClassEntity[],
  academic_year_serivce: AcademicYearService,
  semester_service: SemesterService,
  sheet_service: SheetService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateClassStatusDepartment(
    academic_id,
    semester_id,
    department_id,
    classes,
    academic_year_serivce,
    semester_service,
    sheet_service,
  );

  // Returns objects
  return returnObjectsWithPaging<ClassStatusResponse>(pages, page, payload);
};

export const generateDepartmentStatusResponse = async (
  pages: number,
  page: number,
  academic: AcademicYearEntity,
  semester: SemesterEntity,
  departments: DepartmentEntity[],
  sheet_service: SheetService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateDepartStatus(
    academic,
    semester,
    departments,
    sheet_service,
  );

  // Returns objects
  return returnObjectsWithPaging<ManagerDepartmentResponse>(
    pages,
    page,
    payload,
  );
};

export const groupItemsByHeader = <T>(
  data: T[] | null,
  key: number | string,
) => {
  if (data) {
    const items = data.reduce((r, a) => {
      r[a[key]] = [...(r[a[key]] || []), a];
      return r;
    }, {});

    const results = Object.keys(items).map((key) => [Number(key), items[key]]);

    return results;
  }

  return null;
};

export const generateResponses = async (
  pages: number,
  page: number,
  count: number,
  sheets: SheetEntity[],
  semester: SemesterEntity,
  academic_year: AcademicYearEntity,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to ClassSheetsResponse class
  const payload = await generateAdminSheets(sheets, semester, academic_year);

  // Returns objects
  return returnObjectsWithPaging<ClassSheetsResponse>(
    pages,
    page,
    payload,
    count,
  );
};

export const generateSheetsResponses = async (
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetEntity class to ClassSheetsResponse class
  const payload = await generateAdminSheets(sheets, null, null);

  // Returns objects
  return returnObjects<ClassSheetsResponse>(payload);
};

export const generateObjectIDString = (object_ids: string[]) => {
  return object_ids.map((value) => `"${value}"`).join(',');
};

export const generateObjectIdFromUsers = (users: UserEntity[]) => {
  let std_code: string[] = null;
  if (users && users.length > 0) {
    std_code = users.map((user) => `"${user.std_code}"`);
  }

  return [...new Set(std_code)];
};

export const generateItemIds = (arr_items: any) => {
  const item_ids = [];
  for (const item of arr_items) {
    if (item[1]?.length) {
      for (const j of item[1]) {
        item_ids.push(j.item_id);
      }
    }
  }

  return item_ids;
};

export const generateOptionIds = (arr_items: any) => {
  const option_ids = [];
  for (const item of arr_items) {
    if (item[1]?.length) {
      for (const j of item[1]) {
        option_ids.push(j.option_id);
      }
    }
  }

  return option_ids;
};

export const generateFileIds = (arr_items: any) => {
  const file_ids = arr_items.flatMap((item) => {
    return item[1]?.flatMap((j) => j.files?.map((file) => file.id)) || [];
  });

  return file_ids;
};
