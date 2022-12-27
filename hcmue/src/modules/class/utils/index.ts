import { Request } from 'express';

import { ClassEntity } from '../../../entities/class.entity';

import { returnObjects } from '../../../utils';
import { generateData2Array } from '../transform';

import { ClassResponse } from '../interfaces/class_response.interface';

export const generateClassesResponse = async (
  $class: ClassEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', $class);

  const payload = await generateData2Array($class);

  // Returns object
  return returnObjects<ClassResponse>(payload);
};
