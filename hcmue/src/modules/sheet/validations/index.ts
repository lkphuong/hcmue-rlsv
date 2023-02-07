import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { isEmpty } from 'class-validator';

import { sprintf } from '../../../utils';

import { FormEntity } from '../../../entities/form.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { StudentFileDtos } from '../dtos/update_student_mark.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { SheetService } from '../services/sheet.service';
import { UserService } from '../../user/services/user.service';
import { SemesterService } from '../../semester/services/semester.service';

import { RoleCode } from '../../../constants/enums/role_enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { MAX_FILES } from '../../../constants';
import { ItemControl } from '../constants/enums/item_control.enum';
import {
  DATABASE_EXIT_CODE,
  FILE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ItemCategory } from '../constants/enums/item_category.enum';
import { SheetStatus } from '../constants/enums/status.enum';
import { FormStatus } from '../../form/constants/enums/statuses.enum';
import { OtherService } from '../../other/services/other.service';

export const validateClassId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.CLASS_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateDepartmentId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateSheetId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.SHEET_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateUserId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.USER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateAcademic = async (
  id: number,
  academic_service: AcademicYearService,
  req: Request,
) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.ACADEMIC_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else {
    const academic = await academic_service.getAcademicYearById(id);
    if (!academic) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.ACADEMIC_NOT_FOUND_ERROR, id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }
    return academic;
  }
};

export const validateSemester = async (
  id: number,
  semester_service: SemesterService,
  req: Request,
) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.SEMESTER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else {
    const semester = await semester_service.getSemesterById(id);
    if (!semester) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }
    return semester;
  }
};

export const validateMark = (item: ItemEntity, mark: number, req: Request) => {
  if (
    item.control == ItemControl.INPUT &&
    item.category == ItemCategory.REANGE_VALUE
  ) {
    if (mark > item.to_mark || mark < item.from_mark) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_FORMAT,
        req.method,
        req.url,
        sprintf(
          ErrorMessage.RANGE_MARK_INVALID_FORMAT,
          item.content,
          item.from_mark,
          item.to_mark,
        ),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
  } else if (
    item.control == ItemControl.INPUT &&
    item.category == ItemCategory.PER_UNIT
  ) {
    // Check if either of the following conditions is true:
    // 1. item.mark is positive and mark is negative, or
    // 2. item.mark is negative and mark is positive, or
    // 3. mark is not equal to zero and the remainder of mark divided by item.mark is not equal to zero
    if (
      (item.mark > 0 && mark < 0) ||
      (item.mark < 0 && mark > 0) ||
      (mark != 0 && mark % item.mark != 0)
    ) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_FORMAT,
        req.method,
        req.url,
        sprintf(ErrorMessage.PER_UNIT_INVALID_FORMAT, item.content),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
    // if (item.mark !== mark) {
    //   //#region throw HandlerException
    //   return new HandlerException(
    //     VALIDATION_EXIT_CODE.INVALID_FORMAT,
    //     req.method,
    //     req.url,
    //     sprintf(ErrorMessage.CHECKBOX_MARK_INVALID_FORMAT, item.mark),
    //     HttpStatus.BAD_REQUEST,
    //   );
    //   //#endregion
    // }
  }
  return null;
};

export const validateStudentRole = async (
  role: number,
  request_code: string,
  std_code: string,
  user_service: UserService,
  req: Request,
) => {
  if (role === RoleCode.STUDENT) {
    const user = await user_service.getUserByCode(request_code);
    if (user) {
      if (user.std_code !== std_code) {
        //#region throw HandlerException
        return new HandlerException(
          VALIDATION_EXIT_CODE.INVALID_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.STUDENT_ROLE_INVALID_ERROR, user.fullname),
          HttpStatus.BAD_REQUEST,
        );
        //#endregion
      }
    } else {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.STUDENT_NOT_FOUND_ERROR, std_code),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }
  }

  return null;
};

export const validateOthersRole = async (
  role: number,
  class_id: number,
  department_id: number,
  request_code: string,
  user_service: UserService,
  req: Request,
) => {
  if (role !== RoleCode.ADMIN) {
    const user = await user_service.getUserByCode(request_code);
    if (role === RoleCode.DEPARTMENT) {
      if (user && user.department_id !== department_id) {
        //#region throw HandlerException
        return new HandlerException(
          VALIDATION_EXIT_CODE.INVALID_VALUE,
          req.method,
          req.url,
          sprintf(
            ErrorMessage.DEPARTMENT_ROLE_INVALID_ERROR,
            user.department.name,
          ),
          HttpStatus.BAD_REQUEST,
        );
        //#endregion
      }
    } else {
      if (user && user.class_id !== class_id) {
        //#region throw HandlerException
        return new HandlerException(
          VALIDATION_EXIT_CODE.INVALID_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.CLASS_ROLE_INVALID_ERROR, user.class.name),
          HttpStatus.BAD_REQUEST,
        );
        //#endregion
      }
    }
  }

  return null;
};

export const validateOthersDepartment = async (
  role: number,
  department_id: number,
  user_id: number,
  other_service: OtherService,
  req: Request,
) => {
  const other = await other_service.getOtherById(user_id);

  if (role !== RoleCode.ADMIN) {
    if (other && other.department.id != department_id) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_VALUE,
        req.method,
        req.url,
        sprintf(
          ErrorMessage.DEPARTMENT_ROLE_INVALID_ERROR,
          other.department.name,
        ),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
  }

  return null;
};

export const validateClass = async (
  class_id: number,
  class_service: ClassService,
  req: Request,
) => {
  if (isEmpty(class_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.CLASS_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else if (isNaN(class_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else {
    const $class = await class_service.getClassById(class_id);
    if (!$class) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.CLASS_NOT_FOUND_ERROR, class_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }

    return $class;
  }
};

export const validateDepartment = async (
  department_id: number,
  department_service: DepartmentService,
  req: Request,
) => {
  if (isEmpty(department_id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (isNaN(department_id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else {
    const department = await department_service.getDepartmentById(
      department_id,
    );
    if (!department) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.DEPARTMENT_NOT_FOUND_ERROR, department_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }

    return department;
  }
};

export const validateSheet = async (
  sheet_id: number,
  sheet_service: SheetService,
  req: Request,
): Promise<SheetEntity | HttpException> => {
  if (isEmpty(sheet_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.SHEET_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else if (isNaN(sheet_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else {
    const sheet = await sheet_service.getSheetById(sheet_id);
    if (!sheet) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.SHEET_NOT_FOUND_ERROR, sheet_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }
    return sheet;
  }
};

export const validateUser = async (
  user_id: number,
  user_service: UserService,
  req: Request,
) => {
  if (isEmpty(user_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.USER_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else if (isNaN(user_id)) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  } else {
    const user = await user_service.getUserById(user_id);
    if (!user) {
      //#region throw HandlerException
      return new HandlerException(
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.STUDENT_NOT_FOUND_ERROR, user_id),
        HttpStatus.NOT_FOUND,
      );
      //#endregion
    }

    return user;
  }
};

export const validateTime = async (form: FormEntity, req: Request) => {
  const current = new Date();
  const start = new Date(form.start);
  const end = new Date(form.end);
  const deadline = new Date(end.setDate(new Date(end).getDate() + 1));
  if (current < start || current > deadline || form.status == FormStatus.DONE) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.OUT_OF_EVALUATE_TIME_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }
  return null;
};

export const validateStatusApproval = async (
  sheet: SheetEntity,
  req: Request,
) => {
  if (sheet.status > SheetStatus.WAITING_ADVISER) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.ADVISER_APPROVED_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateUpdateEvaluationMaxFile = (
  files: number,
  params: StudentFileDtos[],
  req: Request,
) => {
  if (files && params) {
    const delete_file = params.filter((e) => e.deleted === 1).length;

    const new_file = params.filter((e) => e.id === 0).length;

    const max_file = files - delete_file + new_file;

    if (max_file > MAX_FILES) {
      return new HandlerException(
        FILE_EXIT_CODE.MAXIMUM_FILE,
        req.method,
        req.url,
        sprintf(ErrorMessage.MAXIMUM_FILE_ERROR, MAX_FILES),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  return null;
};

export const validateCreateEvaluationMaxFile = (
  params: StudentFileDtos[],
  req: Request,
) => {
  const delete_file = params.filter((e) => e.deleted === 1).length;
  const new_file = params.length - delete_file;

  const max_file = new_file - delete_file;

  if (max_file > MAX_FILES) {
    return new HandlerException(
      FILE_EXIT_CODE.MAXIMUM_FILE,
      req.method,
      req.url,
      sprintf(ErrorMessage.MAXIMUM_FILE_ERROR, MAX_FILES),
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const validateRequiredOption = (
  item: ItemEntity,
  option_id: number,
  req: Request,
) => {
  if (
    item.control === ItemControl.SINGLE_SELECT &&
    !option_id &&
    item.required
  ) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.OPTION_EMPTY_ERROR, item.content),
      HttpStatus.BAD_REQUEST,
    );
  } else if (item.control !== ItemControl.SINGLE_SELECT && option_id) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ITEM_NOT_CONFIG_OPTION_ERROR, item.id),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};
