import { UserService } from '../../user/services/user.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { KService } from '../../k/services/k.service';
import { FormService } from '../../form/services/form.service';
import { EvaluationService } from 'src/modules/evaluation/services/evaluation.service';

import { convertObjectId2String } from '../../../utils';

import { User } from '../../../schemas/user.schema';
import { Class } from '../../../schemas/class.schema';

import {
  ClassResponse,
  SheetClassResponse,
  SheetUsersResponse,
  SheetDetailResponse,
  EvaluationResponse,
  SheetEvaluationResponse,
} from '../interfaces/sheet_response.interface';

import { SheetEntity } from '../../../entities/sheet.entity';
import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { FormEntity } from '../../../entities/form.entity';

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
          sum_of_department_marks: sheet.sum_of_class_marks,
          sum_of_class_marks: sheet.sum_of_department_marks,
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
    const payload: ClassResponse[] = [];
    const academic_year_classes = academic_year.academic_year_classes;

    console.log('class_id: ', class_id);

    for (const academic_year_classe of academic_year_classes) {
      let item: ClassResponse = null;
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

// export const generateData2Object = async (
//   sheet: SheetEntity | null,
//   department_service: DepartmentService,
//   class_service: ClassService,
//   user_service: UserService,
//   k_service: KService,
// ) => {
//   if (sheet) {
//     const department = await department_service.getDepartmentById(
//       sheet.department_id,
//     );
//     const user = await user_service.getUserById(sheet.user_id);

//     const result_class = await class_service.getClassById(
//       sheet.class_id,
//       sheet.department_id,
//     );

//     const k = await k_service.getKById(sheet.k);

//     if (department && user && result_class && k) {
//       const evaluations: EvaluationResponse[] = [];
//       const payload: SheetDetailResponse = {
//         id: sheet.id,
//         department: {
//           id: convertObjectId2String(department._id),
//           name: department.name,
//         },
//         class: {
//           id: convertObjectId2String(result_class._id),
//           name: result_class.name,
//         },
//         user: {
//           id: convertObjectId2String(user._id),
//           fullname: user.fullname,
//           std_code: user.username,
//         },
//         semester: {
//           id: sheet.semester.id,
//           name: sheet.semester.name,
//         },
//         academic: {
//           id: sheet.semester.id,
//           name: sheet.academic_year.name,
//         },
//         k: {
//           id: convertObjectId2String(k._id),
//           name: k.name,
//         },
//         level: {
//           id: sheet.level.id,
//           name: sheet.level.name,
//         },
//         status: sheet.status,
//         sum_of_personal_marks: sheet.sum_of_personal_marks,
//         sum_of_class_marks: sheet.sum_of_class_marks,
//         sum_of_department_marks: sheet.sum_of_department_marks,
//         evaluations: evaluations,
//       };

//       return payload;
//     }
//   }

//   return null;
// };

// export const generateDetailSheet2Object = async (
//   sheet: SheetEntity,
//   evaluations: EvaluationEntity[] | null,
//   forms: FormEntity[] | null,
//   evaluation_service: EvaluationService,
//   form_service: FormService,
// ) => {
//   if (sheet) {
//     const payload: SheetEvaluationResponse = {
//       id: sheet.id,
//       academic: {
//         id: sheet.academic_year.id,
//         name: sheet.academic_year.name,
//       },
//       semester: {
//         id: sheet.semester.id,
//         name: sheet.semester.name,
//       },
//       evaluations: [],
//     };

//     if (evaluations) {
//       for await (const evaluation of evaluations) {
//         const item: EvaluationResponse = {
//           form_id: evaluation.form.id,
//           evaluation_id: evaluation.id,
//           parent_id: evaluation.ref,
//           control: evaluation.form.control,
//           content: evaluation.form.content,
//           category: evaluation.form.category,
//           from_mark: evaluation.form.from_mark,
//           to_mark: evaluation.form.to_mark,
//           unit: evaluation.form.unit,
//           children: false,
//           personal_mark_level: evaluation.personal_mark_level,
//           class_mark_level: evaluation.class_mark_level,
//           department_mark_level: evaluation.department_mark_level,
//         };

//         const children = await evaluation_service.getEvaluationByParentId(
//           evaluation.ref,
//         );
//         if (children && children.length > 0) {
//           item.children = true;
//         }

//         payload.evaluations.push(item);
//       }
//     } else {
//       for await (const form of forms) {
//         const item: EvaluationResponse = {
//           form_id: form.id,
//           evaluation_id: 0,
//           parent_id: form.ref,
//           control: form.control,
//           content: form.content,
//           category: form.category,
//           from_mark: form.from_mark,
//           to_mark: form.to_mark,
//           unit: form.unit,
//           children: false,
//           personal_mark_level: 0,
//           class_mark_level: 0,
//           department_mark_level: 0,
//         };

//         const children = await form_service.getFormByParentId(form.ref);
//         if (children && children.length > 0) {
//           item.children = true;
//         }

//         payload.evaluations.push(item);
//       }
//     }

//     return payload;
//   }
//   return null;
// };

// export const generateChildren2Array = async (
//   forms: FormEntity[] | null,
//   form_service: FormService,
// ) => {
//   if (forms && forms.length > 0) {
//     const payload: EvaluationResponse[] = [];
//     for (const form of forms) {
//       const item: EvaluationResponse = {
//         form_id: form.id,
//         evaluation_id: form.evaluation_form[0].id ?? 0,
//         parent_id: form.ref,
//         control: form.control,
//         content: form.content,
//         from_mark: form.from_mark,
//         to_mark: form.to_mark,
//         unit: form.unit,
//         children: false,
//         personal_mark_level: form.evaluation_form[0].personal_mark_level ?? 0,
//         class_mark_level: form.evaluation_form[0].class_mark_level ?? 0,
//         department_mark_level:
//           form.evaluation_form[0].department_mark_level ?? 0,
//         category: form.category,
//       };

//       const children = await form_service.getFormByParentId(form.ref);
//       if (children && children.length > 0) item.children = true;

//       payload.push(item);
//     }
//     return payload;
//   }
//   return null;
// };
