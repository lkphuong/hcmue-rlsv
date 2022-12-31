import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { FormEntity } from '../../../entities/form.entity';

import { convertString2Date } from '../../../utils';

import {
  BaseResponse,
  ItemResponse,
  FormResponse,
  HeaderResponse,
  DetailFormResponse,
} from '../interfaces/form-response.interface';

export const generateHeadersArray = async (headers: HeaderEntity[] | null) => {
  if (headers) {
    const payload: HeaderResponse[] = [];

    for await (const header of headers) {
      const item: HeaderResponse = {
        id: header.id,
        name: header.name,
        max_mark: header.max_mark,
        is_return: header.is_return,
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
      is_return: header.is_return,
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
        mark: ite.mark,
        category: ite.category,
        unit: ite.unit,
        required: ite.required,
        is_file: ite.is_file,
        sort_order: ite.sort_order,
        discipline: ite.discipline,
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
      mark: item.mark,
      category: item.category,
      unit: item.unit,
      required: item.required,
      is_file: item.is_file,
      sort_order: item.sort_order,
      discipline: item.discipline,
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
          name: form.academic_year.start + ' - ' + form.academic_year.end,
        },
        semester: {
          id: form.semester.id,
          name: form.semester.name,
        },
        start: new Date(form.start),
        end: new Date(form.end),
        status: form.status,
        created_at: convertString2Date(form.created_at.toString()),
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
        name: form.academic_year.start + ' - ' + form.academic_year.end,
      },
      semester: {
        id: form.semester.id,
        name: form.semester.name,
      },
      start: form.start,
      end: form.end,
      status: form.status,
    };

    return payload;
  }

  return null;
};

export const generateDetailFormObject = (form: FormEntity | null) => {
  if (form) {
    const payload: DetailFormResponse = {
      id: form.id,
      academic: {
        id: form.academic_year.id,
        name: form.academic_year.start + ' - ' + form.academic_year.end,
      },
      semester: {
        id: form.semester.id,
        name: form.semester.name,
      },
      start: new Date(form.start),
      end: new Date(form.end),
      status: form.status,
      headers: [],
    };
    if (form.headers) {
      for (const header of form.headers) {
        const payload_header: HeaderResponse = {
          id: header.id,
          is_return: header.is_return,
          max_mark: header.max_mark,
          name: header.name,
          titles: [],
        };
        if (header.titles) {
          for (const title of header.titles) {
            const pay_title: BaseResponse = {
              id: title.id,
              name: title.name,
              items: [],
            };
            if (title.items) {
              for (const item of title.items) {
                const payload_item: ItemResponse = {
                  id: item.id,
                  control: item.control,
                  multiple: item.multiple,
                  content: item.content,
                  from_mark: item.from_mark,
                  to_mark: item.to_mark,
                  mark: item.mark,
                  category: item.category,
                  unit: item.unit,
                  required: item.required,
                  is_file: item.is_file,
                  sort_order: item.sort_order,
                  discipline: item.discipline,
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
                pay_title.items.push(payload_item);
              }
            }
            payload_header.titles.push(pay_title);
          }
        }
        payload.headers.push(payload_header);
      }
    }

    return payload;
  }

  return null;
};
