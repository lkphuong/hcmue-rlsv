import { Types } from 'mongoose';

import {
  convertObjectId2String,
  convertString2Date,
  convertString2ObjectId,
} from '../../../utils';
import { mapUserForSheet } from '../utils';

import { Class } from '../../../schemas/class.schema';
import { User } from '../../../schemas/user.schema';

import { ClassEntity } from '../../../entities/class.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { UserService } from '../../user/services/user.service';
import { FilesService } from '../../file/services/files.service';

import {
  BaseResponse,
  ClassSheetsResponse,
  EvaluationsResponse,
  SheetDetailsResponse,
  UserSheetsResponse,
} from '../interfaces/sheet_response.interface';

import {
  HeaderResponse,
  ItemResponse,
  BaseResponse as FormBaseResponse,
} from '../../form/interfaces/form-response.interface';

import { RoleCode } from '../../../constants/enums/role_enum';
import { EvaluationCategory } from '../constants/enums/evaluation_catogory.enum';
import { PDF_EXTENSION } from '../constants';
import { UserEntity } from 'src/entities/user.entity';

export const generateAdminSheets = async (
  sheets: SheetEntity[] | null,
  user_service: UserService,
) => {
  if (sheets && sheets.length > 0) {
    const user_ids: number[] = [];
    const payload: ClassSheetsResponse[] = [];

    //#region Loop of sheets
    for (const sheet of sheets) {
      user_ids.push(sheet.user_id);

      const item: ClassSheetsResponse = {
        id: sheet.id,

        level: sheet.level
          ? { id: sheet.level.id, name: sheet.level.name }
          : null,

        status: sheet.status,
        sum_of_class_marks: sheet.sum_of_class_marks,
        sum_of_department_marks: sheet.sum_of_department_marks,
        sum_of_personal_marks: sheet.sum_of_personal_marks,
        user: {
          id: sheet.user_id,
          fullname: sheet.user.fullname,
          std_code: sheet.user.std_code,
        },
      };

      payload.push(item);
    }
    //#endregion

    return payload;
  }

  return null;
};

export const generateUserSheets = (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: UserSheetsResponse[] = [];
    for (const sheet of sheets) {
      const item: UserSheetsResponse = {
        id: sheet.id,
        semester: {
          id: sheet.semester.id,
          name: sheet.semester.name,
        },
        academic: {
          id: sheet.academic_year.id,
          name: sheet.academic_year.start + ' - ' + sheet.academic_year.end,
        },
        level: sheet.level
          ? {
              id: sheet.level.id,
              name: sheet.level.name,
            }
          : null,
        sum_of_personal_marks: sheet.sum_of_personal_marks,
        sum_of_class_marks: sheet.sum_of_class_marks,
        sum_of_department_marks: sheet.sum_of_department_marks,
        status: sheet.status,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};

export const generateClassSheets = async (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: ClassSheetsResponse[] = [];
    for (const sheet of sheets) {
      if (sheet) {
        const item: ClassSheetsResponse = {
          id: sheet.id,
          user: {
            id: sheet.user.id,
            fullname: sheet.user.fullname,
            std_code: sheet.user.std_code,
          },
          level: sheet.level
            ? {
                id: sheet.level.id,
                name: sheet.level.name,
              }
            : null,
          sum_of_personal_marks: sheet.sum_of_personal_marks,
          sum_of_department_marks: sheet.sum_of_department_marks,
          sum_of_class_marks: sheet.sum_of_class_marks,
          status: sheet.status,
        };

        payload.push(item);
      }
    }

    return payload;
  }

  return null;
};

export const generateClasses2Array = async (classes: ClassEntity[]) => {
  if (classes && classes.length > 0) {
    const payload: BaseResponse[] = [];

    for (const $class of classes) {
      //#region Get class by class_id
      const item: BaseResponse = {
        id: $class.id,
        name: $class.name,
      };
      payload.push(item);
      //#endregion
    }

    return payload;
  }

  return null;
};

export const generateData2Object = async (
  sheet: SheetEntity | null,
  role: number,
  class_service: ClassService,
  department_service: DepartmentService,
  k_service: KService,
  user_service: UserService,
) => {
  if (sheet) {
    //#region Get user by user_id
    const user = await user_service.getUserById(sheet.user_id);
    //#endregion

    //#region Get department by department_id
    const department = await department_service.getDepartmentById(
      sheet.department_id,
    );
    //#endregion

    //#region Get class by class_id
    const classes = await class_service.getClassById(sheet.class_id);
    //#endregion

    //#region Get k by _id
    const k = await k_service.getKById(sheet.k);
    //#endregion
    const payload: SheetDetailsResponse = {
      id: sheet.id,
      department: department
        ? {
            id: department.id,
            name: department.name,
          }
        : null,
      class: classes
        ? {
            id: classes.id,
            name: classes.name,
          }
        : null,
      user: user
        ? {
            id: user.id,
            fullname: user.fullname,
            std_code: user.username,
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
      k: k
        ? {
            id: k.id,
            name: k.name,
          }
        : null,
      level: sheet.level
        ? {
            id: sheet.level.id,
            name: sheet.level.name,
          }
        : null,
      status: sheet.status,
      sum_of_personal_marks: sheet.sum_of_personal_marks,
      sum_of_class_marks: sheet.sum_of_class_marks,
      sum_of_department_marks: sheet.sum_of_department_marks,
      headers: [],
      time_student: {
        start: convertString2Date(sheet.form.student_start.toString()),
        end: convertString2Date(sheet.form.student_end.toString()),
      },
      time_class: {
        start: convertString2Date(sheet.form.class_start.toString()),
        end: convertString2Date(sheet.form.class_end.toString()),
      },
      time_department: {
        start: convertString2Date(sheet.form.department_start.toString()),
        end: convertString2Date(sheet.form.department_end.toString()),
      },
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
            const pay_title: FormBaseResponse = {
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

export const generateItemsArray = async (
  role: number,
  items: ItemEntity[] | null,
  base_url: string,
  file_service: FilesService,
) => {
  if (items) {
    const payload: EvaluationsResponse[] = [];
    switch (role) {
      case RoleCode.STUDENT:
        for (const item of items) {
          const evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.STUDENT,
          );
          if (evaluation) {
            const files = await file_service.getFileByEvaluation(
              evaluation.ref,
              evaluation.sheet.id,
            );
            const result: EvaluationsResponse = {
              id: evaluation.id,
              item: {
                id: item.id,
                content: item.content,
              },
              options: evaluation.option
                ? {
                    id: evaluation.option.id,
                    content: evaluation.option.content,
                  }
                : null,
              files:
                files && files.length > 0
                  ? files.map((file) => {
                      return {
                        id: file.id,
                        url: '/' + file.url,
                        name: file.originalName,
                        type: file.extension == PDF_EXTENSION ? 0 : 1,
                      };
                    })
                  : null,
              personal_mark_level: evaluation.personal_mark_level,
              class_mark_level: evaluation.class_mark_level,
              department_mark_level: evaluation.department_mark_level,
            };

            payload.push(result);
          }
        }
        return payload;

      case RoleCode.CLASS:
        for (const item of items) {
          const class_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.CLASS,
          );
          const student_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.STUDENT,
          );
          if (student_evaluation) {
            const files = await file_service.getFileByEvaluation(
              student_evaluation.ref,
              student_evaluation.sheet.id,
            );
            const result: EvaluationsResponse = {
              id: class_evaluation.id,
              item: {
                id: item.id,
                content: item.content,
              },
              options: class_evaluation.option
                ? {
                    id: class_evaluation.option.id,
                    content: class_evaluation.option.content,
                  }
                : null,
              files:
                files && files.length > 0
                  ? files.map((file) => {
                      return {
                        id: file.id,
                        url: '/' + file.url,
                        name: file.originalName,
                        type: file.extension == PDF_EXTENSION ? 0 : 1,
                      };
                    })
                  : null,
              personal_mark_level: student_evaluation.personal_mark_level,
              class_mark_level: class_evaluation.class_mark_level,
              department_mark_level: class_evaluation.department_mark_level,
            };
            payload.push(result);
          }
        }
        return payload;

      case RoleCode.DEPARTMENT:
      case RoleCode.ADMIN:
        for (const item of items) {
          const department_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.DEPARTMENT,
          );
          const class_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.CLASS,
          );
          const student_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.STUDENT,
          );

          if (student_evaluation) {
            const files = await file_service.getFileByEvaluation(
              student_evaluation.ref,
              student_evaluation.sheet.id,
            );

            const result: EvaluationsResponse = {
              id: department_evaluation.id,
              item: {
                id: item.id,
                content: item.content,
              },
              options: department_evaluation.option
                ? {
                    id: department_evaluation.option.id,
                    content: department_evaluation.option.content,
                  }
                : null,
              files:
                files && files.length > 0
                  ? files.map((file) => {
                      return {
                        id: file.id,
                        url: '/' + file.url,
                        name: file.originalName,
                        type: file.extension == PDF_EXTENSION ? 0 : 1,
                      };
                    })
                  : null,
              personal_mark_level: student_evaluation.personal_mark_level ?? 0,
              class_mark_level: class_evaluation.class_mark_level ?? 0,
              department_mark_level:
                department_evaluation.department_mark_level ?? 0,
            };
            payload.push(result);
          }
        }

        return payload;
    }
  }

  return null;
};

export const generateEvaluationsArray = async (
  role: number,
  evaluations: EvaluationEntity[] | null,
  base_url: string,
  file_service: FilesService,
) => {
  if (evaluations) {
    const payload: EvaluationsResponse[] = [];
    switch (role) {
      case RoleCode.ADMIN:
      case RoleCode.DEPARTMENT:
        for (const evaluation of evaluations) {
          if (evaluation.category === EvaluationCategory.DEPARTMENT) {
            const class_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.CLASS &&
                e.item.id == evaluation.item.id,
            );

            const student_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.STUDENT &&
                e.item.id == evaluation.item.id,
            );

            if (student_evaluation) {
              const files = await file_service.getFileByEvaluation(
                student_evaluation.ref,
                student_evaluation.sheet.id,
              );

              const result: EvaluationsResponse = {
                id: evaluation.id,
                item: {
                  id: evaluation.item.id,
                  content: evaluation.item.content,
                },
                options: evaluation.option
                  ? {
                      id: evaluation.option.id,
                      content: evaluation.option.content,
                    }
                  : null,
                files:
                  files && files.length > 0
                    ? files.map((file) => {
                        return {
                          id: file.id,
                          url: '/' + file.url,
                          name: file.originalName,
                          type: file.extension == PDF_EXTENSION ? 0 : 1,
                        };
                      })
                    : null,
                personal_mark_level:
                  student_evaluation.personal_mark_level ?? 0,
                class_mark_level: class_evaluation.class_mark_level ?? 0,
                department_mark_level: evaluation.department_mark_level ?? 0,
              };
              payload.push(result);
            }
          }
        }
      case RoleCode.CLASS:
        for (const evaluation of evaluations) {
          if (evaluation.category === EvaluationCategory.CLASS) {
            const student_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.STUDENT &&
                e.item.id == evaluation.item.id,
            );

            if (student_evaluation) {
              const files = await file_service.getFileByEvaluation(
                student_evaluation.ref,
                student_evaluation.sheet.id,
              );

              const result: EvaluationsResponse = {
                id: evaluation.id,
                item: {
                  id: evaluation.item.id,
                  content: evaluation.item.content,
                },
                options: evaluation.option
                  ? {
                      id: evaluation.option.id,
                      content: evaluation.option.content,
                    }
                  : null,
                files:
                  files && files.length > 0
                    ? files.map((file) => {
                        return {
                          id: file.id,
                          url: '/' + file.url,
                          name: file.originalName,
                          type: file.extension == PDF_EXTENSION ? 0 : 1,
                        };
                      })
                    : null,
                personal_mark_level:
                  student_evaluation.personal_mark_level ?? 0,
                class_mark_level: evaluation.class_mark_level ?? 0,
                department_mark_level: evaluation.department_mark_level ?? 0,
              };
              payload.push(result);
            }
          }
        }

      case RoleCode.STUDENT:
        for (const evaluation of evaluations) {
          if (evaluation.category === EvaluationCategory.STUDENT) {
            const files = await file_service.getFileByEvaluation(
              evaluation.ref,
              evaluation.sheet.id,
            );
            const result: EvaluationsResponse = {
              id: evaluation.id,
              item: {
                id: evaluation.item.id,
                content: evaluation.item.content,
              },
              options: evaluation.option
                ? {
                    id: evaluation.option.id,
                    content: evaluation.option.content,
                  }
                : null,
              files:
                files && files.length > 0
                  ? files.map((file) => {
                      return {
                        id: file.id,
                        url: '/' + file.url,
                        name: file.originalName,
                        type: file.extension == PDF_EXTENSION ? 0 : 1,
                      };
                    })
                  : null,
              personal_mark_level: evaluation.personal_mark_level ?? 0,
              class_mark_level: evaluation.class_mark_level ?? 0,
              department_mark_level: evaluation.department_mark_level ?? 0,
            };
            payload.push(result);
          }
        }
    }

    return payload;
  }

  return null;
};
