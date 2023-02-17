import { convertString2Float } from '../../../utils';

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
  ClassResponse,
  LevelResponse,
  ReportDepartmentsResponse,
  ReportResponse,
} from '../interfaces/report-response.interface';

import { NO_LEVEL } from '../constants';
import { SheetStatus } from '../../sheet/constants/enums/status.enum';

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
    const classes = await class_service.getClassesByIds(class_ids);
    if (classes && classes.length > 0) {
      for await (const key of data.keys()) {
        const levels = data.get(key);
        const $class = classes.find((c) => c.id === key);

        //#region Get num_of_std by class
        const num_of_std = await sheet_service.countSheets(
          academic_id,
          key,
          department_id,
          semester_id,
          SheetStatus.ALL,
        );

        //#endregion

        //#region Push data to class_response
        class_response.push({
          id: $class.id,
          name: $class.name,
          code: $class.code,
          levels: levels,
          num_of_std: num_of_std,
        });
        //#endregion
      }
    }
    //#endregion

    //#region count not graded for class
    for await (const $class of class_response) {
      const length = $class.levels.length;
      $class.levels[length - 1].count = await sheet_service.countSheetNotGraded(
        academic_id,
        semester_id,
        department_id,
        $class.id,
      );
    }
    //#endregion

    //#region sum not graded
    sum_of_levels[sum_of_levels.length - 1].count =
      await sheet_service.countSheetNotGraded(
        academic_id,
        semester_id,
        department_id,
      );
    //#endregion

    //#region sum_of_std
    sum_of_std = await sheet_service.countSheetsReport(
      academic_id,
      semester_id,
      department_id,
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
    const departments = await department_service.getDepartmentsByIds(
      department_ids,
    );
    if (departments && departments.length > 0) {
      for await (const key of data.keys()) {
        const levels = data.get(key);

        await generateDepartmentLocalLevelResponse(
          levels,
          academic_id,
          semester_id,
          key,
          cache_class_service,
          sheet_service,
        );
        const department = departments.find((d) => d.id === key);

        //#region Get num_of_std by department
        const num_of_std = await sheet_service.countSheetsByDepartment(
          academic_id,
          semester_id,
          key,
          SheetStatus.ALL,
        );

        //#endregion

        //#region Push data to department response
        department_response.push({
          id: department.id,
          name: department.name,
          levels: levels,
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
        await sheet_service.countSheetNotGraded(
          academic_id,
          semester_id,
          department.id,
        );
    }
    //#endregion

    //#region sum not graded
    sum_of_levels[sum_of_levels.length - 1].count =
      await sheet_service.countSheetNotGraded(academic_id, semester_id);
    //#endregion

    //#region sum_of_std
    sum_of_std = await sheet_service.countSheetsReport(
      academic_id,
      semester_id,
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
  items: LevelResponse[],
  academic_id: number,
  semester_id: number,
  department_id: number,
  cache_class_service: CacheClassService,
  sheet_service: SheetService,
) => {
  for await (const i of items) {
    if (i.id == 0) {
      const amount = await sheet_service.countSheetNotGraded(
        academic_id,
        semester_id,
        department_id,
      );
      i.count = amount ? parseInt(amount.toString()) : 0;
    } else {
      const amount = await cache_class_service.amountLevelCacheDepartment(
        academic_id,
        semester_id,
        department_id,
        i.id as number,
      );
      i.count = amount ? parseInt(amount.toString()) : 0;
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
    items[index].count = items[index].count + cache_class.amount;
  }
  return items;
};
