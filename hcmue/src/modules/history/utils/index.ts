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
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  const payload = await generateEvaluationsHistoryArray(
    evaluations,
    different_evaluation,
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
) => {
  const payload: EvaluationHistoryResponse[] = [];
  for (const i of evaluations) {
    payload.push({
      id: i.id,
      item_id: i.item.id,
      personal_mark_level: i?.personal_mark_level ?? 0,
      class_mark_level: i?.class_mark_level ?? 0,
      adviser_mark_level: i?.adviser_mark_level ?? 0,
      department_mark_level: i?.department_mark_level ?? 0,
    });
  }

  return payload;
};

export const getDifferentObjects = (
  evaluation1: EvaluationHistoryResponse[],
  evaluation2: EvaluationHistoryResponse[],
) => {
  const result: EvaluationHistoryResponse[] = [];

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

  return result;
};
