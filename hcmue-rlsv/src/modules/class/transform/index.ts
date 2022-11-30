import { convertObjectId2String } from '../../../utils';

import { AcademicYearClassesEntity } from '../../../entities/academic_year_classes.entity';

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

export const generateClasses2Array = async (
  department_id: string,
  academic_year_classes: AcademicYearClassesEntity[] | null,
  class_service: ClassService,
) => {
  if (academic_year_classes && academic_year_classes.length > 0) {
    const payload: ClassResponse[] = [];

    for (const academic_year_class of academic_year_classes) {
      //#region Get class by class_id
      const result = await class_service.getClassById(
        academic_year_class.class_id,
        department_id,
      );
      //#endregion

      if (result) {
        //#region Generate class response
        const item: ClassResponse = {
          id: convertObjectId2String(result._id),
          name: result.name,
        };

        payload.push(item);
        //#endregion
      }
    }

    return payload;
  }

  return null;
};
