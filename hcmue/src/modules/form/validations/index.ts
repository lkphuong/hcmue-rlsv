import { HttpException, HttpStatus } from '@nestjs/common';
import { arrayNotEmpty, isEmpty } from 'class-validator';
import { Request } from 'express';

import { sprintf } from '../../../utils';

import { FormEntity } from '../../../entities/form.entity';
import { HeaderEntity } from '../../../entities/header.entity';

import { ItemDto, OptionDto } from '../dtos/item.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { FormService } from '../services/form.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { SemesterService } from '../../semester/services/semester.service';
import { TitleService } from '../../title/services/title.service';

import { FormStatus } from '../constants/enums/statuses.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ItemControl } from '../../item/constants/enums/controls.enum';
import { ItemCategory } from '../../item/constants/enums/categories.enum';

export const validateFormId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.FORM_ID_EMPTY_ERROR,
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

export const validateTitleId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.TITLE_ID_EMPTY_ERROR,
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

export const validateHeaderId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.HEADER_ID_EMPTY_ERROR,
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

export const validateItemId = (id: number, req: Request) => {
  if (isEmpty(id)) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.EMPTY,
      req.method,
      req.url,
      ErrorMessage.ITEM_ID_EMPTY_ERROR,
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

export const validateAcademicYear = async (
  academic_id: number,
  academic_service: AcademicYearService,
  req: Request,
) => {
  const academic = await academic_service.getAcademicYearById(academic_id);
  if (!academic) {
    //#region throw HandlerException
    return new UnknownException(
      academic_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ACADEMIC_YEAR_NOT_FOUND_ERROR, academic_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return academic;
};

export const validateForm = async (
  form_id: number,
  form_service: FormService,
  req: Request,
): Promise<FormEntity | HttpException> => {
  const form = await form_service.getFormById(form_id);
  if (!form) {
    return new UnknownException(
      form_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
    );
  }
  if (
    form.status === FormStatus.IN_PROGRESS ||
    form.status === FormStatus.DONE
  ) {
    return new HandlerException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      sprintf(ErrorMessage.FROM_IN_PROGRESS_OR_DONE_ERROR, form_id),
      HttpStatus.BAD_REQUEST,
    );
  }

  return form;
};

export const validateFormPubishStatus = (form: FormEntity, req: Request) => {
  if (form.status !== FormStatus.DRAFTED) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_PUBLISH_STATUS_INVALID_ERROR, form.id),
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }

  return null;
};

export const validateFormUnPubishStatus = (form: FormEntity, req: Request) => {
  if (form.status !== FormStatus.DRAFTED) {
    if (form.status !== FormStatus.PUBLISHED) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_VALUE,
        req.method,
        req.url,
        sprintf(
          form.status !== FormStatus.DONE
            ? ErrorMessage.FORM_IN_PROGRESS_STATUS_INVALID_ERROR
            : ErrorMessage.FORM_DONE_STATUS_INVALID_ERROR,
          form.id,
        ),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
  } else {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.FORM_UNPUBLISH_STATUS_INVALID_ERROR, form.id),
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }

  return null;
};

export const validateHeader = async (
  header_id: number,
  header_service: HeaderService,
  req: Request,
): Promise<HeaderEntity | HttpException> => {
  const header = await header_service.getHeaderById(header_id);
  if (!header) {
    return new UnknownException(
      header_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, header_id),
    );
  }

  return header;
};

export const valiadteItem = async (
  item_id: number,
  item_service: ItemService,
  req: Request,
) => {
  const item = await item_service.getItemById(item_id);
  if (!item) {
    //#region throw HandlerException
    return new UnknownException(
      item_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.ITEM_NOT_FOUND_ERROR, item_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return item;
};

export const validateSemester = async (
  semester_id: number,
  semester_service: SemesterService,
  req: Request,
) => {
  const semester = await semester_service.getSemesterById(semester_id);
  if (!semester) {
    //#region throw HandlerException
    return new UnknownException(
      semester_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, semester_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return semester;
};

export const valiadteTitle = async (
  title_id: number,
  title_service: TitleService,
  req: Request,
) => {
  const title = await title_service.getTitleById(title_id);
  if (!title) {
    //#region throw HandlerException
    return new UnknownException(
      title_id,
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMessage.TITLE_NOT_FOUND_ERROR, title_id),
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }

  return title;
};

export const validateTime = (start: string, end: string, req: Request) => {
  if (
    new Date(start) > new Date(end) ||
    new Date(start) < new Date() ||
    new Date(end) < new Date()
  ) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_FORMAT,
      req.method,
      req.url,
      ErrorMessage.TIME_NAN_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (start === end) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.INVALID_TIME_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const validateItemDto = (params: ItemDto, req: Request) => {
  //#region Get params
  const { control, mark, from_mark, to_mark, category, options } = params;
  //#endregion

  switch (control) {
    case ItemControl.INPUT:
      if (category != ItemCategory.RANGE_VALUE) {
        //#region category = SINGLE_VALUE | PER_UNIT
        if (isEmpty(mark)) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_MARK_EMPTY_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        } else if (mark === 0) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_MARK_MUST_BE_NOT_EQUALS_ZERO_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        }
        //#endregion
      } else {
        //#region category = RANGE_VALUE
        if (isEmpty(from_mark) || isEmpty(to_mark)) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_RANGE_MARKS_EMPTY_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        } else if (to_mark < from_mark) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_RANGE_MARKS_INVALID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        }
        //#endregion
      }
      break;
    case ItemControl.CHECKBOX:
      if (category != ItemCategory.SINGLE_VALUE) {
        //#region throw HandlerException
        return new HandlerException(
          VALIDATION_EXIT_CODE.INVALID_VALUE,
          req.method,
          req.url,
          ErrorMessage.ITEM_CHECKBOX_CATEGORY_INVALID_ERROR,
          HttpStatus.BAD_REQUEST,
        );
        //#endregion
      } else {
        //#region category = SINGLE_VALUE
        if (isEmpty(mark)) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_MARK_EMPTY_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        } else if (mark === 0) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_MARK_MUST_BE_NOT_EQUALS_ZERO_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        }
        //#endregion
      }
      break;
    default:
      if (category != ItemCategory.SINGLE_VALUE) {
        //#region throw HandlerException
        return new HandlerException(
          VALIDATION_EXIT_CODE.INVALID_VALUE,
          req.method,
          req.url,
          ErrorMessage.ITEM_SELECT_CATEGORY_INVALID_ERROR,
          HttpStatus.BAD_REQUEST,
        );
        //#endregion
      } else {
        //#region category = SINGLE_VALUE
        if (!arrayNotEmpty(options) || options.length === 0) {
          //#region throw HandlerException
          return new HandlerException(
            VALIDATION_EXIT_CODE.INVALID_VALUE,
            req.method,
            req.url,
            ErrorMessage.ITEM_OPTIONS_EMPTY_ERROR,
            HttpStatus.BAD_REQUEST,
          );
          //#endregion
        }
        //#endregion
      }
      break;
  }

  return null;
};

export const isAnyPublished = async (
  academic_id: number,
  semester_id: number,
  form_service: FormService,
  req: Request,
) => {
  const form = await form_service.isAnyPublish(semester_id, academic_id);
  if (form) {
    //#region throw HandlerException
    return new HandlerException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      sprintf(
        ErrorMessage.ACADEMIC_EXISTS_FORM_PUBLISHED_IN_SEMESTER_ERROR,
        form.academic_year.name,
        form.semester.name,
      ),
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }

  return null;
};

export const validateMaxMarkHeaderByForm = async (
  header_id: number,
  form_id: number,
  max_mark: number,
  header_service: HeaderService,
  req: Request,
) => {
  if (header_id) {
    //#region update Header
    const sum = await header_service.sumMaxMarkHeaderByFormId(
      form_id,
      header_id,
    );

    if (sum + max_mark > 100) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.MAX_MARK_HEADER_BY_FORM_ERROR, sum + max_mark),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
    //#endregion
  } else {
    //#region Create Header
    const sum = await header_service.sumMaxMarkHeaderByFormId(form_id);

    if (sum + max_mark > 100) {
      //#region throw HandlerException
      return new HandlerException(
        VALIDATION_EXIT_CODE.INVALID_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.MAX_MARK_HEADER_BY_FORM_ERROR, sum + max_mark),
        HttpStatus.BAD_REQUEST,
      );
      //#endregion
    }
    //#endregion
  }
};

export const validateRequiredOption = (
  control: number,
  option: OptionDto[] | null,
  req: Request,
) => {
  if (
    control === ItemControl.SINGLE_SELECT &&
    (!option || option.length === 0)
  ) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.OPTION_EMPTY_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  } else if (
    control !== ItemControl.SINGLE_SELECT &&
    option &&
    option.length > 0
  ) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.ITEM_NOT_CONFIG_OPTION_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }

  return null;
};

export const validateTimePublish = (start: Date, req: Request) => {
  if (new Date(start) < new Date()) {
    return new HandlerException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMessage.TIME_PUBLISH_ERROR,
      HttpStatus.BAD_REQUEST,
    );
  }
};
