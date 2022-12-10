import { AcademicYearEntity } from '../../../../entities/academic_year.entity';
import { FormEntity } from '../../../../entities/form.entity';
import { SemesterEntity } from '../../../../entities/semester.entity';

export interface SheetsPayload {
  payload: {
    data: SheetPayload[];
  };
}

export interface SheetPayload {
  form: FormEntity;
  department_id: string;
  user_id: string;
  class_id: string;
  semester: SemesterEntity;
  academic_year: AcademicYearEntity;
  k: string;
  flag: boolean;
}
