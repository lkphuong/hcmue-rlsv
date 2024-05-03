import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';

import * as exceljs from 'exceljs';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { SemesterEntity } from '../../../entities/semester.entity';

import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

import { ExportReportsDto } from '../dtos/export_excel.dto';

import { CacheClassService } from '../services/cache-class.service';
import { ClassService } from '../../class/services/class.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { DepartmentService } from '../../department/services/department.service';
import { SheetService } from '../../sheet/services/sheet.service';

import {
  generateCacheClassesResponse,
  generateCacheDepartmentsResponse,
} from '../transform';

import { HandlerException } from '../../../exceptions/HandlerException';
import {
  ItemResponse,
  ExportWordTemplateClass,
  ExportWordTemplateDepartment,
  LevelResponse,
  PercenItemResponse,
  TotalItemResponse,
  ExportWordTemplateAdmin,
} from '../interfaces/report-response.interface';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { Configuration } from '../../shared/constants/configuration.enum';
import { PATH_FILE_EXCEL } from '../constants/enums/template.enum';
import { UserService } from '../../user/services/user.service';
import { getTime } from '../utils';
import { AdviserService } from '../../adviser/services/adviser/adviser.service';
import { RoleCode } from '../../../constants/enums/role_enum';

export const exportWordTemplateAdmin = async (
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  academic_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  cache_class_service: CacheClassService,
  department_service: DepartmentService,
  configuration_service: ConfigurationService,
  sheet_service: SheetService,
  req: Request,
) => {
  try {
    // Transform CacheClassEntity class to ReportResponse class
    const payload = await generateCacheDepartmentsResponse(
      academic_year,
      department,
      semester,
      academic_id,
      semester_id,
      cache_classes,
      levels,
      department_service,
      sheet_service,
      cache_class_service,
    );

    if (payload) {
      const { sum_of_std_in_departments } = payload;
      const { day, hour, minute, month, year } = getTime();
      const result: ExportWordTemplateAdmin = {
        semester: semester.name,
        academic_year: academic_year.start + ' - ' + academic_year.end,
        day,
        hour,
        minute,
        month,
        year,
        department: [],
        total: [],
        percen: [],
      };

      const total: TotalItemResponse = {
        tss: payload.sum_of_std_in_departments,
        txs: 0,
        tt: 0,
        tkh: 0,
        ttb: 0,
        ty: 0,
        tk: 0,
        tkxl: payload.sum_of_levels[payload.sum_of_levels.length - 1].count,
      };
      let index = 1;
      for (const i of payload.departments) {
        const department: ItemResponse = {
          index: index++,
          name: i.name,
          ss: i.num_of_std,
          xs: i.levels[0]?.count ?? 0,
          t: i.levels[1]?.count ?? 0,
          kh: i.levels[2]?.count ?? 0,
          tb: i.levels[3]?.count ?? 0,
          y: i.levels[4]?.count ?? 0,
          k: i.levels[5]?.count ?? 0,
          kxl: i.levels[6]?.count ?? 0,
        };
        result.department.push(department);

        //#region sum total
        total.txs += i.levels[0].count;
        total.tt += i.levels[1].count;
        total.tkh += i.levels[2].count;
        total.ttb += i.levels[3].count;
        total.ty += i.levels[4].count;
        total.tk += i.levels[5].count;
        //#endregion
      }

      //#region Update total
      result.total.push(total);
      //#endregion

      //#region Update percen
      const percen: PercenItemResponse = {
        pss: ((total.tss / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        pxs: ((total.txs / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        pt: ((total.tt / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        pkh: ((total.tkh / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        ptb: ((total.ttb / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        py: ((total.ty / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        pk: ((total.tk / sum_of_std_in_departments) * 100).toFixed(2) + '%',
        pkxl: ((total.tkxl / sum_of_std_in_departments) * 100).toFixed(2) + '%',
      };

      result.percen.push(percen);
      //#endregion

      //#region call api
      const EXPORT_SERVICE_URL = configuration_service.get(
        Configuration.EXPORT_SERVICE_URL,
      );

      const EXPORT_SERVICE_PORT = configuration_service.get(
        Configuration.EXPORT_SERVICE_PORT,
      );

      const URL_EXPORT_TEMPLATE_3 = configuration_service.get(
        Configuration.URL_EXPORT_TEMPLATE_3,
      );

      const response = await axios
        .post(
          `http://${EXPORT_SERVICE_URL}:${EXPORT_SERVICE_PORT}/${URL_EXPORT_TEMPLATE_3}`,
          result,
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      return response;
      //#endregion
    } else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.EXPORT_FILE_OPERATOR,
        HttpStatus.EXPECTATION_FAILED,
      );
      //#endregion
    }
  } catch (err) {
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

export const exportWordTemplateDepartment = async (
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  academic_id: number,
  class_id: number,
  department_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  class_service: ClassService,
  configuration_service: ConfigurationService,
  sheet_service: SheetService,
  req: Request,
) => {
  try {
    // Transform CacheClassEntity class to ReportResponse class
    const payload = await generateCacheClassesResponse(
      academic_year,
      department,
      semester,
      academic_id,
      class_id,
      department_id,
      semester_id,
      cache_classes,
      levels,
      class_service,
      sheet_service,
    );

    const { day, hour, minute, month, year } = getTime();

    if (payload) {
      const { sum_of_std_in_classes } = payload;
      const result: ExportWordTemplateDepartment = {
        semester: semester.name,
        academic_year: academic_year.start + ' - ' + academic_year.end,
        department: department.name,
        day,
        hour,
        minute,
        month,
        year,
        class: [],
        total: [],
        percen: [],
      };
      const total: TotalItemResponse = {
        tss: payload.sum_of_std_in_classes,
        txs: 0,
        tt: 0,
        tkh: 0,
        ttb: 0,
        ty: 0,
        tk: 0,
        tkxl: payload.sum_of_levels[payload.sum_of_levels.length - 1].count,
      };
      let index = 1;
      for (const i of payload.classes) {
        const $class: ItemResponse = {
          index: index++,
          name: i.code,
          ss: i.num_of_std,
          xs: i.levels[0]?.count ?? 0,
          t: i.levels[1]?.count ?? 0,
          kh: i.levels[2]?.count ?? 0,
          tb: i.levels[3]?.count ?? 0,
          y: i.levels[4]?.count ?? 0,
          k: i.levels[5]?.count ?? 0,
          kxl: i.levels[6]?.count ?? 0,
        };
        result.class.push($class);

        //#region sum total
        total.txs += i.levels[0].count;
        total.tt += i.levels[1].count;
        total.tkh += i.levels[2].count;
        total.ttb += i.levels[3].count;
        total.ty += i.levels[4].count;
        total.tk += i.levels[5].count;
        //#endregion
      }

      //#region Update total
      result.total.push(total);
      //#endregion

      //#region Update percen
      const percen: PercenItemResponse = {
        pss: ((total.tss / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        pxs: ((total.txs / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        pt: ((total.tt / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        pkh: ((total.tkh / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        ptb: ((total.ttb / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        py: ((total.ty / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        pk: ((total.tk / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        pkxl: ((total.tkxl / sum_of_std_in_classes) * 100).toFixed(2) + '%',
      };

      result.percen.push(percen);
      //#endregion

      //#region call api
      //#region call api
      const EXPORT_SERVICE_URL = configuration_service.get(
        Configuration.EXPORT_SERVICE_URL,
      );

      const EXPORT_SERVICE_PORT = configuration_service.get(
        Configuration.EXPORT_SERVICE_PORT,
      );

      const URL_EXPORT_TEMPLATE_2 = configuration_service.get(
        Configuration.URL_EXPORT_TEMPLATE_2,
      );

      const response = await axios
        .post(
          `http://${EXPORT_SERVICE_URL}:${EXPORT_SERVICE_PORT}/${URL_EXPORT_TEMPLATE_2}`,
          result,
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      return response;
      //#endregion
    } else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.EXPORT_FILE_OPERATOR,
        HttpStatus.EXPECTATION_FAILED,
      );
      //#endregion
    }
  } catch (err) {
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

export const exportWordTemplateClass = async (
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  academic_id: number,
  class_id: number,
  department_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  adviser_service: AdviserService,
  class_service: ClassService,
  configuration_service: ConfigurationService,
  sheet_service: SheetService,
  user_service: UserService,
  req: Request,
) => {
  try {
    // Transform CacheClassEntity class to ReportResponse class
    const payload = await generateCacheClassesResponse(
      academic_year,
      department,
      semester,
      academic_id,
      class_id,
      department_id,
      semester_id,
      cache_classes,
      levels,
      class_service,
      sheet_service,
    );
    const [students, $class, adviser] = await Promise.all([
      user_service.getUsersByClass(academic_id, semester_id, class_id),
      class_service.getClassById(class_id),
      adviser_service.getAdviserByClass(class_id),
    ]);

    const chairman = students?.find(
      (e) => e?.role_user?.role_id == RoleCode.CHAIRMAN,
    );

    const monitor = students?.find(
      (e) => e?.role_user?.role_id == RoleCode.MONITOR,
    );

    const secretary = students?.find(
      (e) => e?.role_user?.role_id == RoleCode.SECRETARY,
    );

    if (payload) {
      const { sum_of_std_in_classes } = payload;
      const { day, hour, minute, month, year } = getTime();
      const result: ExportWordTemplateClass = {
        result: [],
        type: [],
        department: department?.name,
        class_code: $class.code,
        semester: semester.name,
        academic_year: academic_year.start + ' - ' + academic_year.end,
        hour,
        day,
        minute,
        month,
        year,
        adviser: adviser,
        chairman: chairman?.fullname ?? '',
        monitor: monitor?.fullname ?? '',
        secretary: secretary?.fullname ?? '',
      };

      let sum_of_std = 0;
      for (const i of payload.sum_of_levels) {
        const type: LevelResponse = {
          id: i.id,
          name: i.name,
          count: i.count,
          point: ((i.count / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        };
        sum_of_std += parseInt(i.count.toString());
        result.type.push(type);
      }
      result.result.push({
        sum_of_std: sum_of_std,
        sum_point:
          ((sum_of_std / sum_of_std_in_classes) * 100).toFixed(2) + '%',
      });
      //#region call api
      //#region call api
      const EXPORT_SERVICE_URL = configuration_service.get(
        Configuration.EXPORT_SERVICE_URL,
      );

      const EXPORT_SERVICE_PORT = configuration_service.get(
        Configuration.EXPORT_SERVICE_PORT,
      );

      const URL_EXPORT_TEMPLATE_1 = configuration_service.get(
        Configuration.URL_EXPORT_TEMPLATE_1,
      );

      const response = await axios
        .post(
          `http://${EXPORT_SERVICE_URL}:${EXPORT_SERVICE_PORT}/${URL_EXPORT_TEMPLATE_1}`,
          result,
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      return response;
      //#endregion
    } else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.EXPORT_FILE_OPERATOR,
        HttpStatus.EXPECTATION_FAILED,
      );
      //#endregion
    }
  } catch (err) {
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

export const exportExcelTemplateClass = async (
  params: ExportReportsDto,
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  class_service: ClassService,
  sheet_service: SheetService,
  req: Request,
) => {
  try {
    const { academic_id, class_id, department_id, semester_id } = params;

    const sheets = await sheet_service.getSheetsReport(
      academic_id,
      semester_id,
      department_id,
      class_id,
    );

    const payload = await generateCacheClassesResponse(
      academic_year,
      department,
      semester,
      academic_id,
      class_id,
      department_id,
      semester_id,
      cache_classes,
      levels,
      class_service,
      sheet_service,
    );

    if (payload) {
      //#region insert table ranking
      const ranking_length = payload.sum_of_levels.length;
      const { sum_of_std_in_classes } = payload;
      //#region Insert total student

      const workbook = new exceljs.Workbook();

      await workbook.xlsx.readFile(PATH_FILE_EXCEL.TEMPLATE_1A);

      const worksheet = workbook.getWorksheet('Sheet1');

      worksheet.getCell('E14').value = sum_of_std_in_classes + ' SV';
      //#endregion

      for (let i = ranking_length - 1; i >= 0; i--) {
        const { name, count } = payload.sum_of_levels[i];
        const rowValues = [];
        rowValues[4] = name;
        rowValues[5] = count;
        rowValues[6] = ((count / sum_of_std_in_classes) * 100).toFixed(2) + '%';
        worksheet.insertRow(16, rowValues);

        //#region border table raking
        const ranking_rows = ['D16', 'E16', 'F16'];
        for (let i = 0; i < 3; i++) {
          worksheet.getCell(`${ranking_rows[i]}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
        //#endregion
      }
      //#endregion

      const length = sheets.length,
        rows = [];
      for (let i = 0; i < length; i++) {
        const row_values = [];
        row_values[2] = i + 1;
        row_values[3] = sheets[i].std_code;
        row_values[4] = sheets[i].fullname;
        row_values[5] = sheets[i].birthday;
        row_values[6] = sheets[i].sum_of_personal_marks;
        row_values[7] = sheets[i].sum_of_class_marks;
        row_values[8] = sheets[i].sum_of_adviser_marks;
        row_values[9] = sheets[i].flag == 2 ? sheets[i].status : '';
        rows.push(row_values);
      }
      worksheet.insertRows(12, rows, 'i');
      await workbook.xlsx.writeFile(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_1A);

      return true;
    } else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.EXPORT_FILE_OPERATOR,
        HttpStatus.EXPECTATION_FAILED,
      );
      //#endregion
    }
  } catch (err) {
    console.log('err: ', err);
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

export const exportExcelTemplateDepartment = async (
  params: ExportReportsDto,
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  class_service: ClassService,
  sheet_service: SheetService,
  req: Request,
) => {
  try {
    const { academic_id, class_id, department_id, semester_id } = params;
    const sheets = await sheet_service.getSheetsReport(
      academic_id,
      semester_id,
      department_id,
      class_id,
    );

    const payload = await generateCacheClassesResponse(
      academic_year,
      department,
      semester,
      academic_id,
      class_id,
      department_id,
      semester_id,
      cache_classes,
      levels,
      class_service,
      sheet_service,
    );

    if (payload) {
      const workbook = new exceljs.Workbook();
      await workbook.xlsx.readFile(PATH_FILE_EXCEL.TEMPLATE_2A);

      const worksheet = workbook.getWorksheet('Sheet1');
      //#region insert table ranking
      const ranking_length = payload.sum_of_levels.length;
      const { sum_of_std_in_classes } = payload;
      //#region Insert total student
      worksheet.getCell('E13').value = sum_of_std_in_classes + ' SV';
      //#endregion

      for (let i = ranking_length - 1; i >= 0; i--) {
        const { name, count } = payload.sum_of_levels[i];
        const rowValues = [];
        rowValues[4] = name;
        rowValues[5] = count;
        rowValues[6] = ((count / sum_of_std_in_classes) * 100).toFixed(2) + '%';
        worksheet.insertRow(15, rowValues);

        //#region border table raking
        const ranking_rows = ['D15', 'E15', 'F15'];
        for (let i = 0; i < 3; i++) {
          worksheet.getCell(`${ranking_rows[i]}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
        //#endregion
      }
      //#endregion
      const rows = [];
      const length = sheets.length;
      for (let i = 0; i < length; i++) {
        const row_values = [];
        row_values[1] = i + 1;
        row_values[2] = sheets[i].std_code;
        row_values[3] = sheets[i].fullname;
        row_values[4] = sheets[i].birthday;
        row_values[5] = sheets[i].class;
        row_values[6] = sheets[i].sum_of_personal_marks;
        row_values[7] = sheets[i].sum_of_class_marks;
        row_values[8] = sheets[i].sum_of_adviser_marks;
        row_values[9] = sheets[i].sum_of_department_marks;
        row_values[10] =
          sheets[i]?.graded == 0
            ? 'Không xếp loại'
            : sheets[i]?.level
            ? sheets[i]?.level
            : '';
        row_values[11] = sheets[i].flag == 2 ? sheets[i].status : '';
        rows.push(row_values);
      }
      worksheet.insertRows(12, rows, 'i');
      await workbook.xlsx.writeFile(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_2A);

      return true;
    } else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.EXPORT_FILE_OPERATOR,
        HttpStatus.EXPECTATION_FAILED,
      );
      //#endregion
    }
  } catch (err) {
    console.log('err: ', err);
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

// export const exportExcelTemplateAdmin = async (
//   params: ExportReportsDto,
//   academic_year: AcademicYearEntity,
//   department: DepartmentEntity,
//   semester: SemesterEntity,
//   cache_classes: CacheClassEntity[],
//   levels: LevelEntity[],
//   department_service: DepartmentService,
//   sheet_service: SheetService,
//   cache_class_service: CacheClassService,
//   req: Request,
// ) => {
//   try {
//     const { academic_id, semester_id, department_id } = params;
//     const [payload, sheets] = await Promise.all([
//       generateCacheDepartmentsResponse(
//         academic_year,
//         department,
//         semester,
//         academic_id,
//         semester_id,
//         cache_classes,
//         levels,
//         department_service,
//         sheet_service,
//         cache_class_service,
//       ),
//       sheet_service.getSheetsReport(academic_id, semester_id, department_id),
//     ]);
//     if (payload) {
//       const workbook = new exceljs.Workbook();
//       await workbook.xlsx.readFile(PATH_FILE_EXCEL.TEMPLATE_3A);

//       const worksheet = workbook.getWorksheet('Sheet1');
//       //#region insert table ranking
//       const ranking_length = payload.sum_of_levels.length;
//       const { sum_of_std_in_departments } = payload;
//       //#region Insert total student
//       worksheet.getCell('E13').value = sum_of_std_in_departments + ' SV';
//       //#endregion
//       for (let i = ranking_length - 1; i >= 0; i--) {
//         const { name, count } = payload.sum_of_levels[i];
//         const rowValues = [];
//         rowValues[4] = name;
//         rowValues[5] = count;
//         rowValues[6] =
//           ((count / sum_of_std_in_departments) * 100).toFixed(2) + '%';
//         worksheet.insertRow(15, rowValues);

//         //#region border table raking
//         const ranking_rows = ['D15', 'E15', 'F15'];
//         for (let i = 0; i < 3; i++) {
//           worksheet.getCell(`${ranking_rows[i]}`).border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' },
//           };
//         }
//         //#endregion
//       }
//       //#endregion

//       let rows = [],
//         pos = 12;

//       const lenth = sheets.length,
//         chuck = 500;
//       for (let i = 0; i < lenth; i++) {
//         const row_values = [];
//         row_values[2] = i + 1;
//         row_values[3] = sheets[i].std_code;
//         row_values[4] = sheets[i].fullname;
//         row_values[5] = sheets[i].birthday;
//         row_values[6] = sheets[i].class;
//         row_values[7] = sheets[i].department;
//         row_values[8] = sheets[i].sum_of_department_marks;
//         row_values[9] =
//           sheets[i]?.graded == 0
//             ? 'Không xếp loại'
//             : sheets[i]?.level
//             ? sheets[i]?.level
//             : '';
//         row_values[10] = sheets[i].flag == 2 ? sheets[i].status : '';
//         rows.push(row_values);

//         if (rows.length === chuck) {
//           worksheet.insertRows(pos, rows, 'i');
//           rows = [];
//           pos += chuck;
//         }
//       }

//       // console.log('sheets: ', sheets.length);

//       worksheet.insertRows(pos, rows, 'i');

//       await workbook.xlsx.writeFile(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_3A);

//       return true;
//     } else {
//       //#region throw HandlerException
//       throw new HandlerException(
//         DATABASE_EXIT_CODE.NO_CONTENT,
//         req.method,
//         req.url,
//         ErrorMessage.EXPORT_FILE_OPERATOR,
//         HttpStatus.EXPECTATION_FAILED,
//       );
//       //#endregion
//     }
//   } catch (err) {
//     console.log('err: ', err);
//     if (err instanceof HttpException) return err;
//     else {
//       //#region throw HandlerException
//       return new HandlerException(
//         SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//         req.method,
//         req.url,
//       );
//       //#endregion
//     }
//   }
// };

export const exportExcelTemplateAdmin = async (
  params: ExportReportsDto,
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  department_service: DepartmentService,
  sheet_service: SheetService,
  cache_class_service: CacheClassService,
  req: Request,
) => {
  try {
    const { academic_id, semester_id, department_id } = params;

    const sheets = await sheet_service.getSheetsReport(
      academic_id,
      semester_id,
      department_id,
    );

    const length = sheets.length,
      chunk = 500;

    if (length) {
      const workbook = new exceljs.stream.xlsx.WorkbookWriter({
        filename: PATH_FILE_EXCEL.OUTPUT_TEMPLATE_3A,
        useStyles: true,
        useSharedStrings: true,
      });
      const worksheet = workbook.addWorksheet('Sheet1');

      for (let i = 0; i < length; i++) {
        const row_values = [];
        row_values[2] = i + 1;
        row_values[3] = sheets[i].std_code;
        row_values[4] = sheets[i].fullname;
        row_values[5] = sheets[i].birthday;
        row_values[6] = sheets[i].class;
        row_values[7] = sheets[i].department;
        row_values[8] = sheets[i].sum_of_department_marks;
        row_values[9] =
          sheets[i]?.graded == 0
            ? 'Không xếp loại'
            : sheets[i]?.level
            ? sheets[i]?.level
            : '';
        row_values[10] = sheets[i].flag == 2 ? sheets[i].status : '';
        worksheet.addRow(row_values).commit();
      }

      // console.log('sheets: ', sheets.length);

      await workbook.commit();
      return true;
    }

    //await workbook.xlsx.writeFile(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_3A);
    else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.EXPORT_FILE_OPERATOR,
        HttpStatus.EXPECTATION_FAILED,
      );
      //#endregion
    }
  } catch (err) {
    console.log('err: ', err);
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
