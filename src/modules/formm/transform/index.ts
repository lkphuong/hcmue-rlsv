import { FormEntity } from 'src/entities/form.entity';
import { ItemEntity } from 'src/entities/item.entity';
import { TitleEntity } from 'src/entities/title.entity';
import {
  BaseResponse,
  CreateFormResponse,
  ItemResponse,
  OptionResponse,
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

export const generateItem = (item: ItemEntity | null) => {
  if (item) {
    const payload: ItemResponse = {
      id: item.id,
      control: item.control,
      multiple: item.multiple,
      content: item.content,
      from_mark: item.from_mark,
      to_mark: item.to_mark,
      category: item.category,
      unit: item.unit,
      required: item.required,
      options: [],
    };
    if (item.options && item.options.length > 0) {
      for (const option of item.options) {
        const item: OptionResponse = {
          content: option.content,
          from_mark: option.from_mark,
          to_mark: option.to_mark,
          unit: option.unit,
        };
        payload.options.push(item);
      }
    }

    return payload;
  }

  return null;
};
