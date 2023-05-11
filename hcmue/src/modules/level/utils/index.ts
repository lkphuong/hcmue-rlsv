import { Request } from 'express';

import { generateLevelsArray } from '../transforms';
import { returnObjects } from '../../../utils';

import { LevelEntity } from '../../../entities/level.entity';
import { LevelResponse } from '../interfaces/get-levels-response.interface';

export const generateResponses = async (
  levels: LevelEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform LevelEntity class to LevelResponse class
  const payload = await generateLevelsArray(levels);

  // Returns objects
  return returnObjects<LevelResponse>(payload);
};
