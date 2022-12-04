import { Request } from 'express';
import { returnObjects } from '../../../utils';
import { Class } from '../../../schemas/class.schema';
import { generateData2Array } from '../transform';

import { ClassResponse } from '../interfaces/class_response.interface';

export const generateClassesResponse = async (
  $class: Class[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', $class);

  const payload = await generateData2Array($class);

  // Returns object
  return returnObjects<ClassResponse>(payload);
};
