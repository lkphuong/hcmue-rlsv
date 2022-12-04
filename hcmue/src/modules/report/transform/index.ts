import { Types } from 'mongoose';

import { convertString2ObjectId } from '../../../utils';

import { CacheClassEntity } from '../../../entities/cache_class.entity';
import { LevelEntity } from '../../../entities/level.entity';

import { ClassService } from '../../class/services/class.service';

import {
  LevelResponse,
  ReportResponse,
} from '../interfaces/report-response.interface';

import { NO_LEVEL } from '../constants';

export const generateCacheClassesResponse = async (
  cache_classes: CacheClassEntity[] | null,
  levels: LevelEntity[],
  class_service: ClassService,
) => {
  if (cache_classes) {
    const payload: ReportResponse[] = [];
    const class_ids: Types.ObjectId[] = [];
    const data: Map<string, LevelResponse[]> = new Map();

    //#region Generate map data
    for await (const cache_class of cache_classes) {
      let items: LevelResponse[] = [];
      class_ids.push(convertString2ObjectId(cache_class.class_id));

      if (data.has(cache_class.class_id)) {
        items = data.get(cache_class.class_id);
        items = generateLevelResponse(items, cache_class);
      } else {
        items = generateLevelsResponse(levels);
        items = generateLevelResponse(items, cache_class);
      }

      data.set(cache_class.class_id, items);
    }
    //#endregion

    //#region Generate response
    const classes = await class_service.getClasses(class_ids);
    if (classes && classes.length > 0) {
      for await (const key of data.keys()) {
        const levels = data.get(key);
        const $class = classes.find((c) => c._id.toString() === key);

        payload.push({
          id: $class._id.toString(),
          name: $class.name,
          levels: levels,
        });
      }
    }
    //#endregion

    return payload;
  }

  return null;
};

export const generateLevelsResponse = (levels: LevelEntity[]) => {
  const items: LevelResponse[] = levels.map((level) => {
    const item: LevelResponse = {
      id: level.id,
      name: level.name,
      count: 0,
    };

    return item;
  });

  return items;
};

export const generateLevelResponse = (
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
