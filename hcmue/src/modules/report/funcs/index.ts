import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';

import * as exceljs from 'exceljs';
import * as fs from 'fs';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { SemesterEntity } from '../../../entities/semester.entity';

import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

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
import { ExportReportsDto } from '../dtos/export_excel.dto';
import { PATH_FILE_EXCEL } from '../constants/enums/template.enum';

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
      const result: ExportWordTemplateAdmin = {
        department: [],
        total: [],
        percen: [],
      };

      const total: TotalItemResponse = {
        tss: 0,
        txs: 0,
        tt: 0,
        tkh: 0,
        ttb: 0,
        ty: 0,
        tk: 0,
        tkxl: 0,
      };

      for (const i of payload.departments) {
        const department: ItemResponse = {
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
        total.tss += parseInt(i.num_of_std.toString());
        total.txs += i.levels[0].count;
        total.tt += i.levels[1].count;
        total.tkh += i.levels[2].count;
        total.ttb += i.levels[3].count;
        total.ty += i.levels[4].count;
        total.tk += i.levels[5].count;
        total.tkxl += i.levels[6].count;
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
      const url = configuration_service.get(
        Configuration.URL_EXPORT_TEMPLATE_3,
      );

      const response = await axios
        .post(url, result)
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
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
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

    if (payload) {
      const { sum_of_std_in_classes } = payload;
      const result: ExportWordTemplateDepartment = {
        class: [],
        total: [],
        percen: [],
      };

      const total: TotalItemResponse = {
        tss: 0,
        txs: 0,
        tt: 0,
        tkh: 0,
        ttb: 0,
        ty: 0,
        tk: 0,
        tkxl: 0,
      };

      for (const i of payload.classes) {
        const $class: ItemResponse = {
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
        total.tss += parseInt(i.num_of_std.toString());
        total.txs += i.levels[0].count;
        total.tt += i.levels[1].count;
        total.tkh += i.levels[2].count;
        total.ttb += i.levels[3].count;
        total.ty += i.levels[4].count;
        total.tk += i.levels[5].count;
        total.tkxl += i.levels[6].count;
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
      const url = configuration_service.get(
        Configuration.URL_EXPORT_TEMPLATE_2,
      );

      const response = await axios
        .post(url, result)
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
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
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

    if (payload) {
      const { sum_of_std_in_classes } = payload;
      const result: ExportWordTemplateClass = {
        result: [],
        type: [],
      };

      let sum_of_std = 0;
      for (const i of payload.sum_of_levels) {
        const type: LevelResponse = {
          id: i.id,
          name: i.name,
          count: i.count,
          point: ((i.count / sum_of_std_in_classes) * 100).toFixed(2) + '%',
        };
        sum_of_std += i.count;
        result.type.push(type);
      }
      result.result.push({
        sum_of_std: sum_of_std,
        sum_point:
          ((sum_of_std / sum_of_std_in_classes) * 100).toFixed(2) + '%',
      });
      //#region call api
      const url = configuration_service.get(
        Configuration.URL_EXPORT_TEMPLATE_1,
      );

      const response = await axios
        .post(url, result)
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
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
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

    if (sheets && sheets.length > 0) {
      const workbook = new exceljs.Workbook();
      workbook.xlsx.readFile(PATH_FILE_EXCEL.TEMPLATE_1A).then(() => {
        const worksheet = workbook.getWorksheet('Sheet1');
        const length = sheets.length;
        for (let i = 0; i < length; i++) {
          const rowValues = [];
          rowValues[2] = length - i;
          rowValues[3] = sheets[i].std_code;
          rowValues[4] = sheets[i].fullname;
          rowValues[5] = sheets[i].birthday;
          rowValues[6] = sheets[i].sum_of_personal_marks;
          rowValues[7] = sheets[i].sum_of_class_marks;
          rowValues[8] = sheets[i].sum_of_adviser_marks;
          worksheet.insertRow(12, rowValues);
        }
        workbook.xlsx.writeFile(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_1A).then(() => {
          console.log('File is written');
        });
      });
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
