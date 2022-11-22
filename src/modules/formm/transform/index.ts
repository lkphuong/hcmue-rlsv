import { FormEntity } from 'src/entities/form.entity';
import { TitleEntity } from 'src/entities/title.entity';
import {
  BaseResponse,
  CreateFormResponse,
} from '../interfaces/form_response.interface';

export const generateCreateForm = (form: FormEntity) => {
  if (form) {
    const payload: CreateFormResponse = {
      id: form.id,
      academic: {
        id: form.academic_year.id,
        name: form.academic_year.name,
      },
      semester: {
        id: form.semester.id,
        name: form.semester.name,
      },
      student: {
        start: form.student_start,
        end: form.student_end,
      },
      class: {
        start: form.class_start,
        end: form.class_end,
      },
      department: {
        start: form.department_start,
        end: form.department_end,
      },
    };
    return payload;
  }

  return null;
};

export const generateTitle = (title: TitleEntity) => {
  if (title) {
    const payload: BaseResponse = {
      id: title.id,
      name: title.name,
    };

    return payload;
  }

  return null;
};
