import { HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';

import { Request } from 'express';

import { convertString2Date, sprintf } from 'src/utils';

import { ApprovalService } from '../../approval/services/approval.service';
import { LevelService } from '../../level/services/level.service';
import { SheetService } from '../services/sheet.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from 'src/exceptions/UnknownException';
import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/errors.enum';

import { RoleCode } from '../../../constants/enums/role_enum';

export const validateDepartmentId = (id: string, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.DEPARTMENT_ID_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateId = (id: number, req: Request) => {
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
      ErrorMessage.DEPARTMENT_ID_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateMark = (
  mark: number,
  from_mark: number,
  to_mark: number,
  req: Request,
) => {
  if (from_mark && to_mark) {
    if (mark > to_mark || mark < from_mark) {
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_FORMAT,
        req.method,
        req.url,
        sprintf(ErrorMessage.RANGE_MARK_INVALID_FORMAT, from_mark, to_mark),
        HttpStatus.BAD_REQUEST,
      );
    }
  } else if (from_mark && from_mark < mark) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      sprintf(ErrorMessage.SINGLE_MARK_INVALID_FORMAT, from_mark),
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateMarkLevel = async (
  mark: number,
  level_service: LevelService,
  req: Request,
) => {
  const level = await level_service.getLevelByMark(mark);
  if (!level) {
    //#region throw HandleException
    return new UnknownException(
      mark,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.MARK_NOT_FOUND_ERROR, mark),
    );
    //#endregion
  }

  return level;
};

export const validateRole = (role1: number, role2: number, req: Request) => {
  if (role1 != role2 && role2 == RoleCode.ADMIN) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.FORBIDDEN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateApprovalTime = async (
  sheet_id: number,
  role: number,
  approval_service: ApprovalService,
  req: Request,
) => {
  const approval = await approval_service.getApprovalBySheet(sheet_id, role);

  if (approval) {
    const current = new Date();
    if (
      current < convertString2Date(approval.start_at.toString()) ||
      current > convertString2Date(approval.end_at.toString())
    ) {
      return new HandlerException(
        VALIDATION_EXIT_CODE.NO_MATCHING,
        req.method,
        req.url,
        ErrorMessage.PAST_APPROVAL_TIME_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
  } else {
    return new HandlerException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      ErrorMessage.SHEET_NOT_APPROVAL_CONFIG_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateApprove = async (
  status: number,
  sheet_ids: number[],
  sheet_service: SheetService,
  req: Request,
) => {
  const sheets = await sheet_service.countSheetByStatus(status, sheet_ids);
};
