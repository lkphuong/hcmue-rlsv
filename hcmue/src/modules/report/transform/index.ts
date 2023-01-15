import { convertString2Float } from '../../../utils';

import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

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
        items = generateLocalLevelResponse(items, cache_class);
      } else {
        items = generateLevelsResponse(levels);
        items = generateLocalLevelResponse(items, cache_class);
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

        sum_of_std += convertString2Float(num_of_std.toString());
        //#endregion

        //#region Push data to class_response
        class_response.push({
          id: $class.id,
          name: $class.name,
          levels: levels,
          num_of_std: num_of_std,
        });
        //#endregion
      }
    }
    //#endregion

    report_response.classes = class_response;
    report_response.sum_of_levels = sum_of_levels;
    report_response.sum_of_std_in_classes = sum_of_std;

    return report_response;
  }

  return null;
};

export const generateCacheDepartmentsResponse = async (
  academic_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[] | null,
  levels: LevelEntity[],
  department_service: DepartmentService,
  sheet_service: SheetService,
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
        items = generateLocalLevelResponse(items, cache_class);
      } else {
        items = generateLevelsResponse(levels);
        items = generateLocalLevelResponse(items, cache_class);
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
        const department = departments.find((d) => d.id === key);

        //#region Get num_of_std by department
        const num_of_std = await sheet_service.countSheetsByDepartment(
          academic_id,
          semester_id,
          key,
          SheetStatus.ALL,
        );
        sum_of_std += convertString2Float(num_of_std.toString());
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

export const generateLocalLevelResponse = (
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
