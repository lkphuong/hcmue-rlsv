import { Request } from 'express';

import {
  generateCacheClassesResponse,
  generateCacheDepartmentsResponse,
} from '../transform';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { SemesterEntity } from '../../../entities/semester.entity';
import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { SheetService } from '../../sheet/services/sheet.service';

export const generateReportsResponse = async (
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
  sheet_service: SheetService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', cache_classes);

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

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateReportsDepartmentResponse = async (
  academic_year: AcademicYearEntity,
  department: DepartmentEntity,
  semester: SemesterEntity,
  academic_id: number,
  semester_id: number,
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  department_service: DepartmentService,
  sheet_service: SheetService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  //console.log('data: ', cache_classes);

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
  );

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};
