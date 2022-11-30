import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { FormEntity } from '../../../entities/form.entity';

import {
  BaseResponse,
  ItemResponse,
  FormResponse,
  HeaderResponse,
} from '../interfaces/form_response.interface';

export const generateHeadersArray = async (headers: HeaderEntity[] | null) => {
  if (headers) {
    const payload: HeaderResponse[] = [];

    for await (const header of headers) {
      const item: HeaderResponse = {
        id: header.id,
        name: header.name,
        max_mark: header.max_mark,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateHeaderObject = async (header: HeaderEntity | null) => {
  if (header) {
    const payload: HeaderResponse = {
      id: header.id,
      name: header.name,
      max_mark: header.max_mark,
    };

    return payload;
  }

  return null;
};

export const generateItemsArray = async (items: ItemEntity[] | null) => {
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
                  id: option.id,
                  content: option.content,
                  mark: option.mark,
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

export const generateItemObject = async (item: ItemEntity | null) => {
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
                id: option.id,
                content: option.content,
                mark: option.mark,
              };
            })
          : null,
    };
    return payload;
  }
  return null;
};

export const generateTitlesArray = async (titles: TitleEntity[] | null) => {
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

export const generateTitleObject = (title: TitleEntity | null) => {
  if (title) {
    const payload: BaseResponse = {
      id: title.id,
      name: title.name,
    };
    return payload;
  }
  return null;
};

export const generateFormsArray = async (forms: FormEntity[] | null) => {
  if (forms) {
    const payload: FormResponse[] = [];

    for await (const form of forms) {
      const item: FormResponse = {
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
        status: form.status,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateFormObject = (form: FormEntity | null) => {
  if (form) {
    const payload: FormResponse = {
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
      status: form.status,
    };

    return payload;
  }

  return null;
};
