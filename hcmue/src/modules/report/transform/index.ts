import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { LevelEntity } from '../../../entities/level.entity';
import { SemesterEntity } from '../../../entities/semester.entity';

import { CacheClassService } from '../services/cache-class.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { SheetService } from '../../sheet/services/sheet.service';

import {
  AmountLevelCacheDepartment,
  ClassResponse,
  LevelResponse,
  ReportDepartmentsResponse,
  ReportResponse,
} from '../interfaces/report-response.interface';

import { NO_LEVEL } from '../constants';
import { SheetStatus } from '../../sheet/constants/enums/status.enum';
import { ReportCountSheetResponse } from '../../sheet/interfaces/report_response.interface';

export const generateCacheClassesResponse = async (
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  academic_id: number,
  class_id: number,
  department_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[] | null,
  levels: LevelEntity[],
  class_service: ClassService,
  sheet_service: SheetService,
) => {
  if (cache_classes) {
    const report_response: ReportResponse = {
      classes: [],
      sum_of_levels: [],
      sum_of_std_in_classes: 0,
    };

    let sum_of_std = 0;
    let sum_of_levels = generateLevelsResponse(levels);

    const class_response: ClassResponse[] = [];
    const class_ids: number[] = [];
    const data: Map<number, LevelResponse[]> = new Map();

    //#region Generate map data
    for await (const cache_class of cache_classes) {
      let items: LevelResponse[] = [];
      class_ids.push(cache_class.class_id);

      if (data.has(cache_class.class_id)) {
        items = data.get(cache_class.class_id);
        items = await generateLocalLevelResponse(items, cache_class);
      } else {
        items = generateLevelsResponse(levels);
        items = await generateLocalLevelResponse(items, cache_class);
      }

      sum_of_levels = generateGlobalLevelResponse(sum_of_levels, cache_class);
      data.set(cache_class.class_id, items);
    }

    //#endregion

    //#region Generate response

    const [classes, count_sheets, count_sheet_not_graded] = await Promise.all([
      class_service.getClassesByDepartmentId(
        department_id,
        class_id,
        academic_id,
        semester_id,
      ),
      sheet_service.reportCountSheet(
        academic_id,
        semester_id,
        department_id,
        SheetStatus.ALL,
      ),
      sheet_service.reportCountSheet(
        academic_id,
        semester_id,
        department_id,
        SheetStatus.NOT_GRADED,
      ),
    ]);

    if (classes && classes.length > 0) {
      for await (const $class of classes) {
        const key = $class.id;
        const class_levels = data.get(key);

        //#region Get num_of_std by class
        const num_of_std =
          count_sheets?.find((e) => e.class_id == $class.id)?.count ?? 0;

        //#endregion

        //#region Push data to class_response
        class_response.push({
          id: $class.id,
          name: $class.name,
          code: $class.code,
          levels: class_levels ? class_levels : generateLevelsResponse(levels),
          num_of_std: num_of_std,
        });
        //#endregion
      }
    }
    //#endregion

    //#region count not graded for class
    for await (const $class of class_response) {
      const length = $class.levels.length;
      $class.levels[length - 1].count =
        count_sheet_not_graded?.find((e) => e.class_id == $class.id)?.count ??
        0;
    }
    //#endregion

    //#region sum not graded
    sum_of_levels[sum_of_levels.length - 1].count =
      await sheet_service.countSheetNotGraded(
        academic_id,
        semester_id,
        department_id,
        class_id,
      );
    //#endregion

    //#region sum_of_std
    sum_of_std = await sheet_service.countSheetsReport(
      academic_id,
      semester_id,
      department_id,
      class_id,
    );
    //#endregion
    report_response.department = department
      ? {
          id: department.id,
          name: department.name,
        }
      : null;
    report_response.academic = academic_year
      ? {
          id: academic_year.id,
          name: academic_year.start + ' - ' + academic_year.end,
        }
      : null;
    report_response.semester = semester
      ? {
          id: semester.id,
          name: semester.name,
          start: semester.start,
          end: semester.end,
        }
      : null;
    report_response.classes = class_response;
    report_response.sum_of_levels = sum_of_levels;
    report_response.sum_of_std_in_classes = sum_of_std;

    return report_response;
  }

  return null;
};

export const generateCacheDepartmentsResponse = async (
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  academic_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[] | null,
  levels: LevelEntity[],
  department_service: DepartmentService,
  sheet_service: SheetService,
  cache_class_service: CacheClassService,
) => {
  if (cache_classes) {
    const report_response: ReportDepartmentsResponse = {
      departments: [],
      sum_of_levels: [],
      sum_of_std_in_departments: 0,
    };

    let sum_of_std = 0;
    let sum_of_levels = generateLevelsResponse(levels);

    const department_response: ClassResponse[] = [];
    const department_ids: number[] = [];
    const data: Map<number, LevelResponse[]> = new Map();

    //#region Generate map data
    for await (const cache_class of cache_classes) {
      let items: LevelResponse[] = [];
      department_ids.push(cache_class.department_id);

      if (data.has(cache_class.department_id)) {
        items = data.get(cache_class.department_id);
        items = await generateLocalLevelResponse(items, cache_class);
      } else {
        items = generateLevelsResponse(levels);
        items = await generateLocalLevelResponse(items, cache_class);
      }

      sum_of_levels = generateGlobalLevelResponse(sum_of_levels, cache_class);
      data.set(cache_class.department_id, items);
    }
    //#endregion

    //#region Generate response
    const dept_id = department ? department.id : null;

    const [
      departments,
      department_not_grard,
      amount_level_cache_department,
      count_sheets,
      count_sheet_not_graded,
    ] = await Promise.all([
      department_service.getDepartments(dept_id, academic_id, semester_id),
      sheet_service.reportCountSheetAdmin(
        academic_id,
        semester_id,
        null,
        SheetStatus.NOT_GRADED,
      ),
      cache_class_service.amountLevelCacheDepartment(academic_id, semester_id),
      sheet_service.reportCountSheetAdmin(
        academic_id,
        semester_id,
        null,
        SheetStatus.ALL,
      ),
      sheet_service.reportCountSheetAdmin(
        academic_id,
        semester_id,
        null,
        SheetStatus.NOT_GRADED,
      ),
    ]);
    if (departments && departments.length > 0) {
      for await (const department of departments) {
        const key = department.id;
        const department_levels = data.get(key);

        const new_levels = department_levels
          ? department_levels
          : generateLevelsResponse(levels);

        await generateDepartmentLocalLevelResponse(
          department_levels,
          new_levels,
          key,
          department_not_grard,
          amount_level_cache_department,
        );
        //#region Get num_of_std by department
        const num_of_std =
          count_sheets.find((e) => e.department_id == key)?.count ?? 0;
        //#endregion

        //#region Push data to department response
        department_response.push({
          id: department.id,
          name: department.name,
          levels: new_levels,
          num_of_std: num_of_std,
        });
        //#endregion
      }
    }
    //#endregion

    //#region sum not graded for department
    for await (const department of department_response) {
      const length = department.levels.length;
      department.levels[length - 1].count =
        count_sheet_not_graded.find((e) => e.department_id == department.id)
          ?.count ?? 0;
    }
    //#endregion

    //#region sum not graded and region sum_of_std

    [sum_of_levels[sum_of_levels.length - 1].count, sum_of_std] =
      await Promise.all([
        sheet_service.countSheetNotGraded(academic_id, semester_id, dept_id),
        sheet_service.countSheetsReport(academic_id, semester_id, dept_id),
      ]);

    //#endregion

    report_response.department = department
      ? {
          id: department.id,
          name: department.name,
        }
      : null;
    report_response.academic = academic_year
      ? {
          id: academic_year.id,
          name: academic_year.start + ' - ' + academic_year.end,
        }
      : null;
    report_response.semester = semester
      ? {
          id: semester.id,
          name: semester.name,
          start: semester.start,
          end: semester.end,
        }
      : null;
    report_response.departments = department_response;
    report_response.sum_of_levels = sum_of_levels;
    report_response.sum_of_std_in_departments = sum_of_std;

    return report_response;
  }

  return null;
};

export const generateLevelsResponse = (levels: LevelEntity[]) => {
  //#region Generate level reponse from levels
  const items: LevelResponse[] = levels.map((level) => {
    const item: LevelResponse = {
      id: level.id,
      name: level.name,
      count: 0,
    };

    return item;
  });
  //#endregion

  //#region Add extra default level when graded = 0 (Không xếp loại)
  items.push({
    id: '0',
    name: NO_LEVEL,
    count: 0,
  });
  //#endregion

  return items;
};

export const generateLocalLevelResponse = async (
  items: LevelResponse[],
  cache_class: CacheClassEntity,
) => {
  const level_id = cache_class.level ? cache_class.level.id.toString() : '0';
  const index = items.findIndex((item) => item.id.toString() === level_id);

  if (index !== -1) {
    items[index] = cache_class.level
      ? {
          id: cache_class.level.id,
          name: cache_class.level.name,
          count: cache_class.amount,
        }
      : {
          id: '0',
          name: NO_LEVEL,
          count: cache_class.amount,
        };
  }
  return items;
};

export const generateDepartmentLocalLevelResponse = async (
  levels: LevelResponse[],
  items: LevelResponse[],
  department_id: number,
  department_not_grard: ReportCountSheetResponse[],
  cache_class_sheets: AmountLevelCacheDepartment[],
) => {
  if (levels) {
    for await (const i of items) {
      if (i.id == 0) {
        const amount =
          department_not_grard.find((e) => e.department_id == department_id)
            ?.count ?? null;
        i.count = amount ? parseInt(amount.toString()) : 0;
      } else {
        const amount =
          cache_class_sheets.find(
            (e) =>
              e.department_id == department_id &&
              e.level_id == (i.id as number),
          )?.amount ?? null;
        i.count = amount ? parseInt(amount.toString()) : 0;
      }
    }
  } else {
    for await (const i of items) {
      if (i.id == 0) {
        const amount =
          department_not_grard.find((e) => e.department_id == department_id)
            ?.count ?? null;
        i.count = amount ? parseInt(amount.toString()) : 0;
      } else {
        i.count = 0;
      }
    }
  }

  return items;
};

export const generateGlobalLevelResponse = (
  items: LevelResponse[],
  cache_class: CacheClassEntity,
) => {
  const level_id = cache_class.level ? cache_class.level.id.toString() : '0';
  const index = items.findIndex((item) => item.id.toString() === level_id);
  if (index !== -1) {
    items[index].count = (items[index]?.count ?? 0) + cache_class.amount;
  }
  return items;
};
