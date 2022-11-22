import { HeaderEntity } from '../../../entities/header.entity';

import { HeaderResponse } from '../interfaces/header-response.interface';
import { ItemEntity } from '../../../entities/item.entity';

import { ItemResponse } from '../interfaces/items-response.interface';
import { TitleEntity } from '../../../entities/title.entity';

import { TitleResponse } from '../interfaces/title-response.interface';
import { FormEntity } from 'src/entities/form.entity';
import { FormInfoResponse } from '../interfaces/form_response.interface';

export const generateHeaders2Array = async (headers: HeaderEntity[] | null) => {
  if (headers) {
    const payload: HeaderResponse[] = [];
    for await (const header of headers) {
      const item: HeaderResponse = {
        id: header.id,
        name: header.name,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateItems2Array = async (items: ItemEntity[] | null) => {
  if (items) {
    const payload: ItemResponse[] = [];
    for await (const ite of items) {
      const item: ItemResponse = {
        id: ite.id,
        control: ite.control,
        multiple: ite.multiple,
        content: ite.content,
        from_mark: ite.from_mark,
        to_mark: ite.to_mark,
        category: ite.category,
        unit: ite.unit,
        required: ite.required,
        options:
          ite.options && ite.options.length > 0
            ? ite.options.map((option) => {
                return {
                  content: option.content,
                  from_mark: option.from_mark,
                  to_mark: option.to_mark,
                  unit: option.unit,
                };
              })
            : null,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateTitles2Array = async (titles: TitleEntity[] | null) => {
  if (titles) {
    const payload: TitleResponse[] = [];
    for await (const header of titles) {
      const item: TitleResponse = {
        id: header.id,
        name: header.name,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateForms2Array = async (forms: FormEntity[] | null) => {
  if (forms) {
    const payload: FormInfoResponse[] = [];
    for await (const form of forms) {
      const item: FormInfoResponse = {
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

      payload.push(item);
    }

    return payload;
  }

  return null;
};
