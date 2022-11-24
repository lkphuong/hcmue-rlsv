import { User } from '../../../schemas/user.schema';
import { Class } from '../../../schemas/class.schema';

import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';
import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';

import { convertObjectId2String } from '../../../utils';

import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';

import {
  SheetClassResponse,
  SheetUsersResponse,
  SheetDetailResponse,
  ItemDetailResponse,
  EvaluationDetailResponse,
  BaseResponse,
} from '../interfaces/sheet_response.interface';

export const generateSheets2SheetUsuer = (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: SheetUsersResponse[] = [];
    for (const sheet of sheets) {
      const item: SheetUsersResponse = {
        id: sheet.id,
        semester: {
          id: sheet.semester.id,
          name: sheet.semester.name,
        },
        academic: {
          id: sheet.academic_year.id,
          name: sheet.academic_year.name,
        },
        level: {
          id: sheet.level.id,
          name: sheet.level.name,
        },
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

export const generateSheets2Class = async (
  sheets: SheetEntity[] | null,
  user_service: UserService,
  input?: string,
) => {
  if (sheets && sheets.length > 0) {
    const payload: SheetClassResponse[] = [];
    for (const sheet of sheets) {
      let result: User = null;
      if (input) {
        result = await user_service.getUserByInput(sheet.user_id, input);
      } else {
        result = await user_service.getUserById(sheet.user_id);
      }
      if (result) {
        const item: SheetClassResponse = {
          id: sheet.id,
          user: {
            id: convertObjectId2String(result._id),
            fullname: result.fullname,
            std_code: result.username,
          },
          level: {
            id: sheet.level.id,
            name: sheet.level.name,
          },
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

export const generateAcademicYearClass2Array = async (
  department_id: string,
  class_id: string,
  academic_year: AcademicYearEntity | null,
  class_service: ClassService,
) => {
  if (
    academic_year.academic_year_classes &&
    academic_year.academic_year_classes.length > 0
  ) {
    const payload: BaseResponse[] = [];
    const academic_year_classes = academic_year.academic_year_classes;

    for (const academic_year_classe of academic_year_classes) {
      let item: BaseResponse = null;
      let result: Class = null;
      if (class_id) {
        result = await class_service.getClassById(class_id, department_id);
        if (result) {
          item = {
            id: convertObjectId2String(result._id),
            name: result.name,
          };
          payload.push(item);
          return payload;
        }
      } else {
        result = await class_service.getClassById(
          academic_year_classe.class_id,
          department_id,
        );

        if (result) {
          item = {
            id: convertObjectId2String(result._id),
            name: result.name,
          };
          payload.push(item);
        }
      }
    }

    return payload;
  }

  return null;
};

export const generateData2Object = async (
  sheet: SheetEntity | null,
  department_service: DepartmentService,
  class_service: ClassService,
  user_service: UserService,
  k_service: KService,
) => {
  if (sheet) {
    const department = await department_service.getDepartmentById(
      sheet.department_id,
    );
    const user = await user_service.getUserById(sheet.user_id);

    const result_class = await class_service.getClassById(
      sheet.class_id,
      sheet.department_id,
    );

    const k = await k_service.getKById(sheet.k);

    if (department && user && result_class && k) {
      const headers: BaseResponse[] = [];
      const payload: SheetDetailResponse = {
        id: sheet.id,
        department: {
          id: convertObjectId2String(department._id),
          name: department.name,
        },
        class: {
          id: convertObjectId2String(result_class._id),
          name: result_class.name,
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
        level: {
          id: sheet.level.id,
          name: sheet.level.name,
        },
        status: sheet.status,
        sum_of_personal_marks: sheet.sum_of_personal_marks,
        sum_of_class_marks: sheet.sum_of_class_marks,
        sum_of_department_marks: sheet.sum_of_department_marks,
        headers: headers,
      };

      if (sheet?.form?.headers && sheet?.form?.headers.length > 0) {
        for (const header of sheet.form.headers) {
          const item: BaseResponse = {
            id: header.id,
            name: header.name,
          };
          payload.headers.push(item);
        }
      }
      return payload;
    }
  }

  return null;
};

export const generateDetailTile2Object = (items: ItemEntity[] | null) => {
  if (items) {
    const payload: ItemDetailResponse[] = [];
    for (const item of items) {
      const tmp: ItemDetailResponse = {
        id: item.evaluations[0].id,
        item: {
          id: item.id,
          content: item.content,
        },
        option: [],
        personal_mark_level: item.evaluations[0].personal_mark_level,
        class_mark_level: item.evaluations[0].class_mark_level,
        department_mark_level: item.evaluations[0].department_mark_level,
      };
      for (const i of item.options) {
        tmp.option.push({
          id: i.id,
          content: i.content,
        });
      }
      payload.push(tmp);
    }

    return payload;
  }
  return null;
};

export const generateEvaluation2Array = (
  evaluations: EvaluationEntity[] | null,
) => {
  if (evaluations) {
    const payload: EvaluationDetailResponse[] = [];
    for (const evaluation of evaluations) {
      const item: EvaluationDetailResponse = {
        id: evaluation.id,
        item: {
          id: evaluation.item.id,
          content: evaluation.item.content,
        },
        option: evaluation.option
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
