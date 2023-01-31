import * as moment from 'moment';
import { SemesterEntity } from '../../../entities/semester.entity';

import { SemesterResponse } from '../interfaces/semester_response.interface';

export const generateData2Array = (semesters: SemesterEntity[] | null) => {
  if (semesters && semesters.length > 0) {
    const payload: SemesterResponse[] = [];
    for (const semester of semesters) {
      const item: SemesterResponse = {
        id: semester.id,
        name: semester.name,
        academic: {
          id: semester.academic.id,
          name: semester.academic.start + ' - ' + semester.academic.end,
        },
        start: semester.start,
        end: semester.end,
        display: `${semester.name} (${moment(semester.start).format(
          'MM/YYYY',
        )} - ${moment(semester.end).format('MM/YYYY')})`,
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
      academic: {
        id: semester.id,
        name: semester.academic.start + ' - ' + semester.academic.end,
      },
      start: semester.start,
      end: semester.end,
      display: `${semester.name} (${moment(semester.start).format(
        'MM/YYYY',
      )} - ${moment(semester.end).format('MM/YYYY')})`,
    };
    return payload;
  }

  return null;
};
