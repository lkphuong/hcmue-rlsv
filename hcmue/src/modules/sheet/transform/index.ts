import { User } from '../../../schemas/user.schema';

import { AcademicYearClassesEntity } from '../../../entities/academic_year_classes.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { UserService } from '../../user/services/user.service';

import {
  BaseResponse,
  ClassSheetsResponse,
  EvaluationsResponse,
  ItemsResponse,
  SheetDetailsResponse,
  UserSheetsResponse,
} from '../interfaces/sheet_response.interface';

import { convertObjectId2String } from '../../../utils';
import { mapUserForSheet } from '../utils';

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
          name: sheet.academic_year.name,
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

export const generateClassSheets = async (
  users: User[] | null,
  sheets: SheetEntity[] | null,
) => {
  if (sheets && sheets.length > 0) {
    const payload: ClassSheetsResponse[] = [];
    for (const user of users) {
      const sheet = mapUserForSheet(convertObjectId2String(user._id), sheets);
      if (sheet) {
        const item: ClassSheetsResponse = {
          id: sheet.id,
          user: {
            id: convertObjectId2String(user._id),
            fullname: user.fullname,
            std_code: user.username,
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

export const generateClasses2Array = async (
  department_id: string,
  academic_year_classes: AcademicYearClassesEntity[] | null,
  class_service: ClassService,
) => {
  if (academic_year_classes && academic_year_classes.length > 0) {
    const payload: BaseResponse[] = [];

    for (const academic_year_class of academic_year_classes) {
      //#region Get class by class_id
      const result = await class_service.getClassById(
        academic_year_class.class_id,
        department_id,
      );
      //#endregion

      if (result) {
        //#region Generate class response
        const item: BaseResponse = {
          id: convertObjectId2String(result._id),
          name: result.name,
        };

        payload.push(item);
        //#endregion
      }
    }

    return payload;
  }

  return null;
};

export const generateData2Object = async (
  sheet: SheetEntity | null,
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
    const classes = await class_service.getClassById(
      sheet.class_id,
      sheet.department_id,
    );
    //#endregion

    //#region Get k by _id
    const k = await k_service.getKById(sheet.k);
    //#endregion

    if (department && user && classes && k) {
      const headers: BaseResponse[] = [];
      const payload: SheetDetailsResponse = {
        id: sheet.id,
        department: {
          id: convertObjectId2String(department._id),
          name: department.name,
        },
        class: {
          id: convertObjectId2String(classes._id),
          name: classes.name,
        },
        user: {
          id: convertObjectId2String(user._id),
          fullname: user.fullname,
          std_code: user.username,
        },
        semester: {
          id: sheet.semester.id,
          name: sheet.semester.name,
        },
        academic: {
          id: sheet.semester.id,
          name: sheet.academic_year.name,
        },
        k: {
          id: convertObjectId2String(k._id),
          name: k.name,
        },
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
        headers: headers,
      };

      //#region Get headers
      if (sheet?.form?.headers && sheet?.form?.headers.length > 0) {
        for (const header of sheet.form.headers) {
          const item: BaseResponse = {
            id: header.id,
            name: header.name,
          };
          payload.headers.push(item);
        }
      }
      //#endregion

      return payload;
    }
  }

  return null;
};

export const generateItemsArray = (items: ItemEntity[] | null) => {
  if (items) {
    const payload: ItemsResponse[] = [];

    for (const item of items) {
      const result: ItemsResponse = {
        id: item.evaluations[0].id,
        item: {
          id: item.id,
          content: item.content,
        },
        options: [],
        personal_mark_level: item.evaluations[0].personal_mark_level,
        class_mark_level: item.evaluations[0].class_mark_level,
        department_mark_level: item.evaluations[0].department_mark_level,
      };

      //#region Get options by item
      for (const i of item.options) {
        result.options.push({
          id: i.id,
          content: i.content,
        });
      }
      //#endregion

      payload.push(result);
    }

    return payload;
  }

  return null;
};

export const generateEvaluationsArray = (
  evaluations: EvaluationEntity[] | null,
) => {
  if (evaluations) {
    const payload: EvaluationsResponse[] = [];

    for (const evaluation of evaluations) {
      const item: EvaluationsResponse = {
        id: evaluation.id,
        item: {
          id: evaluation.item.id,
          content: evaluation.item.content,
        },

        options: evaluation.option
          ? { id: evaluation.option.id, content: evaluation.option.content }
          : null,

        personal_mark_level: evaluation.personal_mark_level,
        class_mark_level: evaluation.class_mark_level,
        department_mark_level: evaluation.department_mark_level,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
