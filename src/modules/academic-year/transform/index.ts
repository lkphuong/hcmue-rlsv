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
        name: academic_year.name,
      };

      payload.push(item);
    }
    return payload;
  }

  return null;
};
