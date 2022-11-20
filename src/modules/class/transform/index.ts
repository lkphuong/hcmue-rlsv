import { convertObjectId2String } from 'src/utils';
import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { Class } from '../../../schemas/class.schema';

import { ClassService } from '../services/class.service';

import { ClassResponse } from '../interfaces/class_response.interface';

export const generateData2Array = (classes: Class[] | null) => {
  if (classes && classes.length > 0) {
    const payload: ClassResponse[] = [];
    for (const item of classes) {
      const result: ClassResponse = {
        id: convertObjectId2String(item._id),
        name: item.name,
      };
      payload.push(result);
    }

    return payload;
  }

  return null;
};

export const generateAcademicYearClass2Array = async (
  department_id: string,
  academic_year: AcademicYearEntity | null,
  class_service: ClassService,
) => {
  if (
    academic_year.academic_year_classes &&
    academic_year.academic_year_classes.length > 0
  ) {
    const payload: ClassResponse[] = [];
    const academic_year_classes = academic_year.academic_year_classes;

    for (const academic_year_classe of academic_year_classes) {
      const result = await class_service.getClassById(
        academic_year_classe.class_id,
        department_id,
      );
      console.log(result);
      if (result) {
        const item: ClassResponse = {
          id: convertObjectId2String(result._id),
          name: result.name,
        };
        payload.push(item);
      }
    }

    return payload;
  }

  return null;
};
