import { Request } from 'express';

import { generateCacheClassesResponse } from '../transform';

import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

import { ClassService } from '../../class/services/class.service';

export const generateReportsResponse = async (
  cache_classes: CacheClassEntity[],
  levels: LevelEntity[],
  class_service: ClassService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', cache_classes);

  // Transform CacheClassEntity class to ReportResponse class
  const payload = await generateCacheClassesResponse(
    cache_classes,
    levels,
    class_service,
  );

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};
