import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { AcademicYearResponse } from '../interfaces/academic_year_response.interface';

export const generateData2Array = (
  academic_years: AcademicYearEntity[] | null,
) => {
  if (academic_years && academic_years.length > 0) {
    const payload: AcademicYearResponse[] = [];
    for (const academic_year of academic_years) {
      const item: AcademicYearResponse = {
        id: academic_year.id,
        name: academic_year.start + ' - ' + academic_year.end,
      };

      payload.push(item);
    }
    return payload;
  }

  return null;
};

export const generateData2Object = (
  academic_year: AcademicYearEntity | null,
) => {
  if (academic_year) {
    const payload: AcademicYearResponse = {
      id: academic_year.id,
      name: academic_year.start + ' - ' + academic_year.end,
    };

    return payload;
  }

  return null;
};
