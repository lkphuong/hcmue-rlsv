import { Request } from 'express';

import { generateFailedResponse, generateSuccessResponse } from '../utils';
import { sprintf } from '../../../utils';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { AcademicYearService } from '../services/academic_year.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { UnknownException } from '../../../exceptions/UnknownException';

import { DATABASE_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const createAcademic = async (
  from: number,
  to: number,
  user_id: number,
  academic_service: AcademicYearService,
  req: Request,
) => {
  let academic = new AcademicYearEntity();
  academic.name = `${from}-${to}`;
  academic.active = true;
  academic.created_at = new Date();
  academic.created_by = user_id;
  academic = await academic_service.add(academic);
  if (academic) {
    //#region Generate response
    return await generateSuccessResponse(academic, req, null);
    //#endregion
  } else {
    //#region throw HandlerException
    return generateFailedResponse(
      req,
      ErrorMessage.OPERATOR_ACADEMIC_YEAR_ERROR,
    );
    //#endregion
  }
};

export const unlinkAcademic = async (
  academic_id: number,
  user_id: number,
  academic_service: AcademicYearService,
  req: Request,
) => {
  const academic = await academic_service.getAcademicYearById(academic_id);
  if (academic) {
    const result = await academic_service.unlink(academic_id, user_id);
    if (result) {
      //#region Generate response
      return await generateSuccessResponse(academic, req, null);
      //#endregion
    } else {
      //#region throw HandlerException
      return generateFailedResponse(
        req,
        ErrorMessage.OPERATOR_ACADEMIC_YEAR_ERROR,
      );
      //#endregion
    }
  } else {
    //#region throw HandleException
    return new UnknownException(
      academic_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_NOT_FOUND_ERROR, academic_id),
    );
    //#endregion
  }
};
