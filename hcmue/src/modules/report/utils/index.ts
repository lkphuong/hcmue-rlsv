import { Request } from 'express';

import { generateCacheClassesResponse } from '../transform';

import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

import { ClassService } from '../../class/services/class.service';
import { SheetService } from '../../sheet/services/sheet.service';

export const generateReportsResponse = async (
  academic_id: number,
  class_id: string,
  department_id: string,
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
