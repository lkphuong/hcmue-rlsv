import { Request } from 'express';

import { generateClasses2Array } from '../transform';
import { returnObjects } from '../../../utils';

import { AcademicYearClassesEntity } from '../../../entities/academic_year_classes.entity';

import { ClassResponse } from '../interfaces/class_response.interface';
import { ClassService } from '../services/class.service';

export const generateClassesResponse = async (
  department_id: string,
  data: AcademicYearClassesEntity[] | null,
  class_service: ClassService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', data);

  const classes = await generateClasses2Array(
    department_id,
    data,
    class_service,
  );

  // Returns object
  return returnObjects<ClassResponse>(classes);
};
