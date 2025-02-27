import { SemesterEntity } from '../../../entities/semester.entity';

import { SemesterResponse } from '../interfaces/semester_response.interface';

export const generateData2Array = (semesters: SemesterEntity[] | null) => {
  if (semesters && semesters.length > 0) {
    const payload: SemesterResponse[] = [];
    for (const semester of semesters) {
      const item: SemesterResponse = {
        id: semester.id,
        name: semester.name,
      };

      payload.push(item);
    }
    return payload;
  }
  return null;
};

export const generateData2Object = (semester: SemesterEntity | null) => {
  if (semester) {
    const payload: SemesterResponse = {
      id: semester.id,
      name: semester.name,
    };
    return payload;
  }

  return null;
};
