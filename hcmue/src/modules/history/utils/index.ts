import { Request } from 'express';

import { returnObjects, returnObjectsWithPaging } from '../../../utils';

import { SheetHistoryEntity } from '../../../entities/sheet_history.entity';
import { UserEntity } from '../../../entities/user.entity';
import { AdviserEntity } from '../../../entities/adviser.entity';
import { OtherEntity } from '../../../entities/other.entity';

import {
  generateData2Array,
  generateData2Object,
  generateEvaluationsHistoryArray,
} from '../transforms';

import { EvaluationHistoryResponse, SheetHistoryResponse } from '../interfaces';
import { EvaluationHistoryEntity } from '../../../entities/evaluation_history.entity';
import { RoleCode } from '../../../constants/enums/role_enum';
import { EvaluationCategory } from '../../sheet/constants/enums/evaluation_catogory.enum';

export const generateSheet = async (
  sheet: SheetHistoryEntity,
  role: number,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateData2Object(sheet, role);

  return returnObjects(payload);
};

export const generateSheetPagination = (
  pages: number,
  page: number,
  sheets: SheetHistoryEntity[],
  students: UserEntity[],
  advisers: AdviserEntity[],
  others: OtherEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform SheetHistoryEntity class to UserSheetsResponse
  const payload = generateData2Array(sheets, students, advisers, others);

  return returnObjectsWithPaging<SheetHistoryResponse>(pages, page, payload);
};

export const generateEvaluationsResponse = async (
  evaluations: EvaluationHistoryEntity[],
  different_evaluation: EvaluationHistoryResponse[],
  role: number,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateEvaluationsHistoryArray(
    evaluations,
    different_evaluation,
    role,
  );

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateEvaluationsArray = (
  evaluations: EvaluationHistoryEntity[],
  role_id: number,
) => {
  const catogory = generateCategoryByRole(role_id);
  const payload: EvaluationHistoryResponse[] = [];
  for (const i of evaluations) {
    if (i.category == catogory) {
      payload.push({
        id: i.id,
        item_id: i.item.id,
        personal_mark_level: i?.personal_mark_level ?? 0,
        class_mark_level: i?.class_mark_level ?? 0,
        adviser_mark_level: i?.adviser_mark_level ?? 0,
        department_mark_level: i?.department_mark_level ?? 0,
      });
    }
  }

  return payload;
};

export const getDifferentObjects = (
  evaluation1: EvaluationHistoryResponse[],
  evaluation2: EvaluationHistoryResponse[],
) => {
  const result: EvaluationHistoryResponse[] = [];

  if (evaluation2?.length && evaluation1?.length) {
    for (const obj1 of evaluation1) {
      const matching_obj = evaluation2.find(
        (obj2) => obj2.item_id === obj1.item_id,
      );

      if (
        matching_obj &&
        (matching_obj.personal_mark_level !== obj1.personal_mark_level ||
          matching_obj.class_mark_level !== obj1.class_mark_level ||
          matching_obj.adviser_mark_level !== obj1.adviser_mark_level ||
          matching_obj.department_mark_level !== obj1.department_mark_level)
      ) {
        result.push(matching_obj);
      }
    }
  } else if (evaluation1?.length) {
    for (const obj of evaluation1) {
      if (
        obj.adviser_mark_level ||
        obj.personal_mark_level ||
        obj.class_mark_level ||
        obj.department_mark_level
      ) {
        result.push(obj);
      }
    }
  } else {
    for (const obj of evaluation2) {
      if (
        obj.adviser_mark_level ||
        obj.personal_mark_level ||
        obj.class_mark_level ||
        obj.department_mark_level
      ) {
        result.push(obj);
      }
    }
  }

  return result;
};

export const generateCategoryByRole = (role: number) => {
  switch (role) {
    case RoleCode.ADMIN:
    case RoleCode.DEPARTMENT:
      return EvaluationCategory.DEPARTMENT;
    case RoleCode.MONITOR:
    case RoleCode.SECRETARY:
    case RoleCode.CHAIRMAN:
      return EvaluationCategory.CLASS;
    case RoleCode.ADVISER:
      return EvaluationCategory.ADVISER;
    case RoleCode.STUDENT:
      return EvaluationCategory.STUDENT;
  }
};
