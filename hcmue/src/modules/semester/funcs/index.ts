import { Request } from 'express';

import { generateFailedResponse, generateSuccessResponse } from '../utils';
import { sprintf } from '../../../utils';

import { SemesterEntity } from '../../../entities/semester.entity';

import { SemesterDto } from '../dtos/semester.dto';

import { SemesterService } from '../services/semester.service';

import { UnknownException } from '../../../exceptions/UnknownException';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { DATABASE_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const createSemester = async (
  params: SemesterDto,
  request_code: string,
  semester_service: SemesterService,
  req: Request,
) => {
  //#region Get params
  const { academic_id, end, name, start } = params;
  //#endregion
  let semester = new SemesterEntity();
  semester.name = name;
  semester.academic_id = academic_id;
  semester.start = new Date(start);
  semester.end = new Date(end);
  semester.active = true;
  semester.created_at = new Date();
  semester.created_by = request_code;
  semester = await semester_service.add(semester);
  if (semester) {
    //#region Generate response
    return await generateSuccessResponse(semester, req, null);
    //#endregion
  } else {
    //#region throw HandlerException
    return generateFailedResponse(req, ErrorMessage.OPERATOR_SEMESTER_ERROR);
    //#endregion
  }
};

export const unlinkSemester = async (
  semester_id: number,
  request_code: string,
  semester_service: SemesterService,
  req: Request,
) => {
  const semester = await semester_service.getSemesterById(semester_id);
  if (semester) {
    const result = await semester_service.unlink(semester_id, request_code);
    if (result) {
      //#region Generate response
      return await generateSuccessResponse(semester, req, null);
      //#endregion
    } else {
      //#region throw HandlerException
      return generateFailedResponse(req, ErrorMessage.OPERATOR_SEMESTER_ERROR);
      //#endregion
    }
  } else {
    //#region throw HandleException
    return new UnknownException(
      semester_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, semester_id),
    );
    //#endregion
  }
};
