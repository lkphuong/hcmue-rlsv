import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { FormEntity } from '../../../entities/form.entity';

import {
  BaseResponse,
  ItemResponse,
  FormInfoResponse,
} from '../interfaces/form_response.interface';

export const generateHeaders2Array = async (headers: HeaderEntity[] | null) => {
  if (headers) {
    const payload: BaseResponse[] = [];
    for await (const header of headers) {
      const item: BaseResponse = {
        id: header.id,
        name: header.name,
      };
      payload.push(item);
    }
    return payload;
  }
  return null;
};

export const generateHeader2Object = async (header: HeaderEntity | null) => {
  if (header) {
    const payload: BaseResponse = {
      id: header.id,
      name: header.name,
    };
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

export const generateItem2Object = async (item: ItemEntity | null) => {
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
      options:
        item.options && item.options.length > 0
          ? item.options.map((option) => {
              return {
                content: option.content,
                from_mark: option.from_mark,
                to_mark: option.to_mark,
                unit: option.unit,
              };
            })
          : null,
    };
    return payload;
  }
  return null;
};

export const generateTitles2Array = async (titles: TitleEntity[] | null) => {
  if (titles) {
    const payload: BaseResponse[] = [];
    for await (const title of titles) {
      const item: BaseResponse = {
        id: title.id,
        name: title.name,
      };
      payload.push(item);
    }
    return payload;
  }
  return null;
};

export const generateTitle2Object = (title: TitleEntity | null) => {
  if (title) {
    const payload: BaseResponse = {
      id: title.id,
      name: title.name,
    };
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

export const generateForm2Object = (form: FormEntity | null) => {
  if (form) {
    const payload: FormInfoResponse = {
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
