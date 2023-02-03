import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { EvaluationEntity } from '../../../entities/evaluation.entity';
import { FormEntity } from '../../../entities/form.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';
import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { SemesterEntity } from '../../../entities/semester.entity';

import { FilesService } from '../../file/services/files.service';
import { SheetService } from '../services/sheet.service';

import { GetClassStatusAdviserHistoryDto } from '../dtos/get_classes_status_adviser_history.dto';

import {
  BaseResponse,
  ClassResponse,
  ClassSheetsResponse,
  ClassStatusResponse,
  DepartmentResponse,
  EvaluationsResponse,
  ManagerDepartmentResponse,
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
import { SheetStatus } from '../constants/enums/status.enum';
import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { SemesterService } from '../../semester/services/semester.service';

export const generateAdminSheets = async (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: ClassSheetsResponse[] = [];

    //#region Loop of sheets
    for (const sheet of sheets) {
      const item: ClassSheetsResponse = {
        id: sheet.id,

        level: sheet.level
          ? { id: sheet.level.id, name: sheet.level.name }
          : null,

        status: sheet.status,
        sum_of_class_marks: sheet.sum_of_class_marks,
        sum_of_adviser_marks: sheet.sum_of_adviser_marks,
        sum_of_department_marks: sheet.sum_of_department_marks,
        sum_of_personal_marks: sheet.sum_of_personal_marks,
        user: {
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
        sum_of_adviser_marks: sheet.sum_of_adviser_marks,
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
          sum_of_adviser_marks: sheet.sum_of_adviser_marks,
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

export const generateData2Object = async (sheet: SheetEntity | null) => {
  if (sheet) {
    const current = new Date();
    const end = new Date(sheet.form.end);
    const deadline = new Date(end.setDate(new Date(end).getDate() + 1));
    const success = current > deadline || sheet.graded == 0 ? true : false;
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
      sum_of_personal_marks: sheet.sum_of_personal_marks,
      sum_of_class_marks: sheet.sum_of_class_marks,
      sum_of_adviser_marks: sheet.sum_of_adviser_marks,
      sum_of_department_marks: sheet.sum_of_department_marks,
      headers: [],
      start: sheet.form.start,
      end: sheet.form.end,
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
              adviser_mark_level: evaluation.adviser_mark_level,
              department_mark_level: evaluation.department_mark_level,
            };

            payload.push(result);
          }
        }
        return payload;

      case RoleCode.MONITOR:
      case RoleCode.SECRETARY:
      case RoleCode.CHAIRMAN:
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
              adviser_mark_level: class_evaluation.adviser_mark_level,
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

          const adviser_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.ADVISER,
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
              adviser_mark_level: adviser_evaluation.adviser_mark_level ?? 0,
              department_mark_level:
                department_evaluation.department_mark_level ?? 0,
            };
            payload.push(result);
          }
        }

        return payload;

      case RoleCode.ADVISER:
        for (const item of items) {
          const adviser_evaluation = item.evaluations.find(
            (e) => e.category == EvaluationCategory.ADVISER,
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
              adviser_mark_level: adviser_evaluation.adviser_mark_level,
              department_mark_level: adviser_evaluation.department_mark_level,
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

            const addviser_evaluation = evaluations.find(
              (e) =>
                e.category == EvaluationCategory.ADVISER &&
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
                  student_evaluation?.personal_mark_level ?? 0,
                class_mark_level: class_evaluation?.class_mark_level ?? 0,
                adviser_mark_level:
                  addviser_evaluation?.adviser_mark_level ?? 0,
                department_mark_level: evaluation?.department_mark_level ?? 0,
              };
              payload.push(result);
            }
          }
        }
      case RoleCode.MONITOR:
      case RoleCode.SECRETARY:
      case RoleCode.CHAIRMAN:
        for (const evaluation of evaluations) {
          if (evaluation.category === EvaluationCategory.CLASS) {
            const student_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.STUDENT &&
                e.item.id == evaluation.item.id,
            );

            const department_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.DEPARTMENT &&
                e.item.id == evaluation.item.id,
            );

            const addviser_evaluation = evaluations.find(
              (e) =>
                e.category == EvaluationCategory.ADVISER &&
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
                  student_evaluation?.personal_mark_level ?? 0,
                class_mark_level: evaluation?.class_mark_level ?? 0,
                adviser_mark_level:
                  addviser_evaluation?.adviser_mark_level ?? 0,
                department_mark_level:
                  department_evaluation?.department_mark_level ?? 0,
              };
              payload.push(result);
            }
          }
        }
      case RoleCode.ADVISER:
        for (const evaluation of evaluations) {
          if (evaluation.category === EvaluationCategory.ADVISER) {
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

            const department_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.DEPARTMENT &&
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
                  student_evaluation?.personal_mark_level ?? 0,
                class_mark_level: class_evaluation?.class_mark_level ?? 0,
                adviser_mark_level: evaluation?.adviser_mark_level ?? 0,
                department_mark_level:
                  department_evaluation?.department_mark_level ?? 0,
              };
              payload.push(result);
            }
          }
        }
      case RoleCode.STUDENT:
        for (const evaluation of evaluations) {
          if (evaluation.category === EvaluationCategory.STUDENT) {
            const class_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.CLASS &&
                e.item.id == evaluation.item.id,
            );

            const department_evaluation = evaluations.find(
              (e) =>
                e.category === EvaluationCategory.DEPARTMENT &&
                e.item.id == evaluation.item.id,
            );

            const addviser_evaluation = evaluations.find(
              (e) =>
                e.category == EvaluationCategory.ADVISER &&
                e.item.id == evaluation.item.id,
            );

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
              personal_mark_level: evaluation?.personal_mark_level ?? 0,
              class_mark_level: class_evaluation?.class_mark_level ?? 0,
              adviser_mark_level: addviser_evaluation?.adviser_mark_level ?? 0,
              department_mark_level:
                department_evaluation?.department_mark_level ?? 0,
            };
            payload.push(result);
          }
        }
    }

    return payload;
  }

  return null;
};

export const generateClassStatusAdviser = async (
  role: number,
  department_id: number,
  $class: ClassEntity[],
  form: FormEntity,
  sheet_service: SheetService,
) => {
  const payload: ClassStatusResponse = {
    academic: {
      id: form.academic_year.id ?? null,
      name: form.academic_year.start + ' - ' + form.academic_year.end,
    },
    semester: {
      id: form.semester.id,
      name: form.semester.name,
      start: form.semester.start,
      end: form.semester.end,
    },
    class: [],
  };

  for (const i of $class) {
    let count = 0;
    if (role == RoleCode.ADVISER) {
      count = await sheet_service.countSheetByStatus(
        form.academic_year.id,
        form.semester.id,
        SheetStatus.WAITING_ADVISER,
        department_id,
        i.id,
        form.id,
      );
    } else {
      count = await sheet_service.countSheetByStatus(
        form.academic_year.id,
        form.semester.id,
        SheetStatus.WAITING_CLASS,
        department_id,
        i.id,
        form.id,
      );
    }

    const item: ClassResponse = {
      id: i.id,
      name: i.name,
      code: i.code,
      status: count > 0 ? false : true,
    };

    payload.class.push(item);
  }

  return payload;
};

export const generateClassStatusAdviserHistory = async (
  role: number,
  params: GetClassStatusAdviserHistoryDto,
  $class: ClassEntity,
  forms: FormEntity[],
  sheet_service: SheetService,
) => {
  const payload: ClassResponse[] = [];

  //#region Get params
  const { class_id, department_id, academic_id, semester_id } = params;
  //#endregion
  for (const i of forms) {
    let count = 0;
    if (role === RoleCode.ADVISER) {
      count = await sheet_service.countSheetByStatus(
        academic_id,
        semester_id,
        SheetStatus.WAITING_ADVISER,
        department_id,
        class_id,
        i.id,
      );
    } else {
      count = await sheet_service.countSheetByStatus(
        academic_id,
        semester_id,
        SheetStatus.WAITING_CLASS,
        department_id,
        class_id,
        i.id,
      );
    }

    const item: ClassResponse = {
      id: $class.id,
      code: $class.code,
      name: $class.name,
      status: count > 0 ? false : true,
      academic: {
        id: i.academic_year.id,
        name: i.academic_year.start + ' - ' + i.academic_year.end,
      },
      semester: {
        id: i.semester.id,
        name: i.semester.name,
        start: i.semester.start,
        end: i.semester.end,
      },
    };

    payload.push(item);
  }

  return payload;
};

export const generateClassStatusDepartment = async (
  academic_id: number,
  semester_id: number,
  department_id: number,
  classes: ClassEntity[],
  academic_year_serivce: AcademicYearService,
  semester_service: SemesterService,
  sheet_service: SheetService,
) => {
  // const payload: ClassResponse[] = [];

  const academic = await academic_year_serivce.getAcademicYearById(academic_id);
  const semester = await semester_service.getSemesterById(semester_id);

  const payload: ClassStatusResponse = {
    academic: {
      id: academic.id ?? null,
      name: academic.start + ' - ' + academic.end,
    },
    semester: {
      id: semester.id,
      name: semester.name,
      start: semester.start,
      end: semester.end,
    },
    class: [],
  };

  for await (const i of classes) {
    const count = await sheet_service.countSheetByStatus(
      academic_id,
      semester_id,
      SheetStatus.WAITING_DEPARTMENT,
      department_id,
      i.id,
    );
    const item: ClassResponse = {
      id: i.id,
      code: i.code,
      name: i.name,
      status: count > 0 ? false : true,
    };

    payload.class.push(item);
  }

  return payload;
};

export const generateDepartStatus = async (
  academic: AcademicYearEntity,
  semester: SemesterEntity,
  departments: DepartmentEntity[],
  sheet_service: SheetService,
) => {
  const payload: ManagerDepartmentResponse = {
    academic: {
      id: academic.id,
      name: academic.start + ' - ' + academic.end,
    },
    semester: {
      id: semester.id,
      name: semester.name,
      start: semester.start,
      end: semester.end,
    },
    department: [],
  };
  for await (const i of departments) {
    const count = await sheet_service.countSheetByStatus(
      academic.id,
      semester.id,
      SheetStatus.WAITING_DEPARTMENT,
      i.id,
    );

    const item: DepartmentResponse = {
      id: i.id,
      name: i.name,
      status: count > 0 ? false : true,
    };

    payload.department.push(item);
  }

  return payload;
};
