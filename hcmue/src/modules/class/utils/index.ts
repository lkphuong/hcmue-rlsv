import { Request } from 'express';

import { ClassEntity } from '../../../entities/class.entity';

import { returnObjects, returnObjectsWithPaging } from '../../../utils';
import { generateData2Array } from '../transform';

import { ClassResponse } from '../interfaces/class_response.interface';

export const generateClassesResponse = async (
  pages: number,
  page: number,
  classes: ClassEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateData2Array(classes);

  // Returns object
  return returnObjectsWithPaging<ClassResponse>(pages, page, payload);
};

export const generateSuccessResponse = (
  classes: ClassEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = generateData2Array(classes);

  // Returns object
  return returnObjects<ClassResponse>(payload);
};
