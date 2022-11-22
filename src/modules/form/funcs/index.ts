import { HeaderEntity } from 'src/entities/header.entity';
import { HeaderService } from 'src/modules/header/services/header.service';
import { Request } from 'express';
import { HttpException } from '@nestjs/common';
import { UpdateHeaderDto } from '../dtos/update-header.dto';
import { DataSource } from 'typeorm';
import { FormService } from '../services/form.service';
import { UnknownException } from 'src/exceptions/UnknownException';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from 'src/constants/enums/error-code.enum';
import { sprintf } from 'src/utils';
import { ErrorMessage } from '../constants/errors.enum';
import { HandlerException } from 'src/exceptions/HandlerException';
import { JwtPayload } from 'src/modules/auth/interfaces/payloads/jwt-payload.interface';
import { generateSuccessResponse } from '../utils';

export const updateHeader = async (
  id: number,
  params: UpdateHeaderDto,
  header_service: HeaderService,
  form_service: FormService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Get params
  const { form_id, name } = params;
  //#endregion

  const { user_id } = req.user as JwtPayload;

  //Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  await query_runner.connect();

  let header: HeaderEntity | HttpException | null = null;
  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Validate title
    header = await header_service.getHeaderById(id);
    if (header) {
      //#region Validate form_id
      const form = await form_service.getFormById(form_id);
      if (form) {
        //#region Update data header
        header.form = form;
        header.name = name;
        header.updated_by = user_id;
        header.updated_at = new Date();
        //#endregion

        //#region Update header
        header = await header_service.update(header, query_runner.manager);
        //#endregion

        return await generateSuccessResponse(header, query_runner, req);
      } else {
        //#region Throw exception
        throw new UnknownException(
          form_id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
        );
        //#endregion
      }
      //#endregion
    } else {
      //#region Throw exception
      return new UnknownException(
        id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.HEADER_NOT_FOUND_ERROR, id),
      );
      //#endregion
    }
    //#endregion
  } catch (e) {
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('--------------------------------------------------------');
    console.log(req.method + ' - ' + req.url + ': ' + e.message);

    if (e instanceof HttpException) return e;
    else {
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};

export const addHeader = async (
  params: UpdateHeaderDto,
  header_service: HeaderService,
  form_service: FormService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Get params
  const { form_id, name } = params;
  //#endregion

  const { user_id } = req.user as JwtPayload;

  //Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();
    //#region Validate form_id
    const form = await form_service.getFormById(form_id);
    if (form) {
      let header = new HeaderEntity();
      //#region add data header
      header.form = form;
      header.name = name;
      header.created_by = user_id;
      header.created_at = new Date();
      header.updated_by = user_id;
      header.updated_at = new Date();
      header.active = true;
      header.deleted = false;
      //#endregion

      //#region Update header
      header = await header_service.add(header, query_runner.manager);
      //#endregion

      return await generateSuccessResponse(header, query_runner, req);
    } else {
      //#region Throw exception
      throw new UnknownException(
        form_id,
        DATABASE_EXIT_CODE.UNKNOW_VALUE,
        req.method,
        req.url,
        sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, form_id),
      );
      //#endregion
    }
    //#endregion
    //#endregion
  } catch (err) {
    console.log(err);
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('--------------------------------------------------------');
    console.log(req.method + ' - ' + req.url + ': ' + err.message);

    if (err instanceof HttpException) return err;
    else {
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};
