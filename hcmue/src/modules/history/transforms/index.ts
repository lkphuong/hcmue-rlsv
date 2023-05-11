import { convertString2Date, removeDuplicates } from '../../../utils';

import { AdviserEntity } from '../../../entities/adviser.entity';
import { OtherEntity } from '../../../entities/other.entity';
import { SheetHistoryEntity } from '../../../entities/sheet_history.entity';
import { UserEntity } from '../../../entities/user.entity';
import { EvaluationHistoryEntity } from '../../../entities/evaluation_history.entity';

import {
  HeaderResponse,
  ItemResponse,
} from '../../form/interfaces/form-response.interface';
import {
  EvaluationsResponse,
  SheetDetailsResponse,
} from '../../sheet/interfaces/sheet_response.interface';
import { EvaluationHistoryResponse, SheetHistoryResponse } from '../interfaces';

import { ROLE_ALLOW_RETURN } from '../../sheet/constants';
import { SheetStatus } from '../../sheet/constants/enums/status.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import { EvaluationCategory } from '../../sheet/constants/enums/evaluation_catogory.enum';

export const generateData2Object = async (
  sheet: SheetHistoryEntity | null,
  role: number,
) => {
  if (sheet) {
    const current = new Date();
    const end = new Date(sheet.form.end);
    const deadline = new Date(end.setDate(new Date(end).getDate() + 1));
    const success =
      current > deadline ||
      sheet.status === SheetStatus.SUCCESS ||
      sheet.status === SheetStatus.NOT_GRADED
        ? true
        : false;
    const is_return =
      current < deadline &&
      sheet.status == SheetStatus.NOT_GRADED &&
      sheet?.user?.status?.flag &&
      ROLE_ALLOW_RETURN.includes(role)
        ? true
        : false;
    const payload: SheetDetailsResponse = {
      id: sheet.id,
      department: sheet.department
        ? {
            id: sheet.department.id,
            name: sheet.department.name,
          }
        : null,
      class: sheet.class
        ? {
            id: sheet.class.id,
            name: sheet.class.name,
          }
        : null,
      user: sheet.user
        ? {
            fullname: sheet.user.fullname,
            std_code: sheet.user.std_code,
          }
        : null,
      semester: {
        id: sheet.semester.id,
        name: sheet.semester.name,
      },
      academic: {
        id: sheet.academic_year.id,
        name: sheet.academic_year.start + ' - ' + sheet.academic_year.end,
      },
      k: sheet.K
        ? {
            id: sheet.K.id,
            name: sheet.K.name,
          }
        : null,
      level: sheet.level
        ? {
            id: sheet.level.id,
            name: sheet.level.name,
          }
        : null,
      status: sheet.status,
      success: success,
      is_return: is_return,
      sum_of_personal_marks: sheet.sum_of_personal_marks,
      sum_of_class_marks: sheet.sum_of_class_marks,
      sum_of_adviser_marks: sheet.sum_of_adviser_marks,
      sum_of_department_marks: sheet.sum_of_department_marks,
      headers: [],
      start: convertString2Date(sheet.form.start.toString()),
      end: convertString2Date(sheet.form.end.toString()),
    };

    //#region Get headers
    if (sheet.form && sheet.form.headers) {
      for (const header of sheet.form.headers) {
        const payload_header: HeaderResponse = {
          id: header.id,
          is_return: header.is_return,
          max_mark: header.max_mark,
          name: header.name,
          titles: [],
        };
        if (header.titles) {
          for (const title of header.titles) {
            const pay_title = {
              //FormBaseResponse
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
    //#endregion
    return payload;
  }

  return null;
};

export const generateData2Array = (
  sheets: SheetHistoryEntity[],
  students: UserEntity[],
  advisers: AdviserEntity[],
  others: OtherEntity[],
) => {
  const payload: SheetHistoryResponse[] = [];

  for (const sheet of sheets) {
    if (sheet.role === Role.ADVISER) {
      const adviser = advisers.find((e) => e.id == Number(sheet.created_by));
      if (adviser) {
        payload.push({
          id: sheet.id,
          fullname: adviser.fullname,
          role: sheet.role,
          created_at: convertString2Date(adviser.created_at.toString()),
          point: generatePoint(sheet),
        });
      }
    } else if (sheet.role === Role.DEPARTMENT || sheet.role === Role.ADMIN) {
      const other = others.find((e) => e.id == Number(sheet.created_by));
      if (other) {
        payload.push({
          id: sheet.id,
          fullname: other.username,
          role: sheet.role,
          created_at: convertString2Date(other.created_at.toString()),
          point: generatePoint(sheet),
        });
      }
    } else {
      const student = students.find((e) => e.id == Number(sheet.created_by));
      if (student) {
        payload.push({
          id: sheet.id,
          fullname: student.fullname,
          role: sheet.role,
          created_at: convertString2Date(student.created_at.toString()),
          point: generatePoint(sheet),
        });
      }
    }
  }

  return payload;
};

export const generateEvaluationsHistoryArray = async (
  evaluations: EvaluationHistoryEntity[] | null,
  different_evaluation: EvaluationHistoryResponse[],
) => {
  if (evaluations) {
    const payload: EvaluationsResponse[] = [];
    const ids = evaluations.map((i) => {
      return i.item.id;
    });
    const results = removeDuplicates(ids);

    for (const i of results) {
      const class_evaluation = evaluations.find(
        (e) => e.category === EvaluationCategory.CLASS && e.item.id == i,
      );

      const addviser_evaluation = evaluations.find(
        (e) => e.category == EvaluationCategory.ADVISER && e.item.id == i,
      );

      const department_evaluation = evaluations.find(
        (e) => e.category === EvaluationCategory.DEPARTMENT && e.item.id == i,
      );

      const student_evaluation = evaluations.find(
        (e) => e.category === EvaluationCategory.STUDENT && e.item.id == i,
      );

      const evaluation = evaluations.find((e) => e.item.id == i);

      if (evaluation) {
        const eva = different_evaluation?.find((e) => e.item_id == i) ?? false;
        const result: EvaluationsResponse = {
          id: department_evaluation?.id ?? 0,
          item: {
            id: i,
            content: evaluation.item.content,
          },
          options: evaluation.option
            ? {
                id: evaluation.option.id,
                content: evaluation.option.content,
              }
            : null,
          flag: eva ? true : false,
          personal_mark_level: student_evaluation?.personal_mark_level ?? 0,
          class_mark_level: class_evaluation?.class_mark_level ?? 0,
          adviser_mark_level: addviser_evaluation?.adviser_mark_level ?? 0,
          department_mark_level:
            department_evaluation?.department_mark_level ?? 0,
        };
        payload.push(result);
      }
    }

    return payload;
  }

  return null;
};

export const generatePoint = (sheet_history: SheetHistoryEntity) => {
  switch (sheet_history.role) {
    case Role.ADVISER:
      return sheet_history.sum_of_adviser_marks;
    case Role.ADMIN:
    case Role.DEPARTMENT:
      return sheet_history.sum_of_department_marks;
    case Role.STUDENT:
      return sheet_history.sum_of_personal_marks;
    default:
      return sheet_history.sum_of_class_marks;
  }
};
