import { HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import { removeFile } from '../../../utils';
import {
  generateUploadFileFailedResponse,
  generateUploadFileSuccessResponse,
} from '../utils';

import { validateFileUser } from '../validations';

import { FileEntity } from '../../../entities/file.entity';

import { HandlerException } from '../../../exceptions/HandlerException';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { FilesService } from '../services/files.service';
import { LogService } from '../../log/services/log.service';
import { UserService } from '../../user/services/user.service';

import { UPLOAD_DEST } from '../../../constants';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const uploadFile = async (
  destination: string,
  extension: string,
  filename: string,
  original_name: string,
  request_code: string,
  file_service: FilesService,
  data_source: DataSource,
  req: Request,
) => {
  // // Make the QueryRunner
  // const query_runner = data_source.createQueryRunner();

  // // Establish real database connection
  // await query_runner.connect();

  try {
    // // Start transaction
    // await query_runner.startTransaction();

    const url = `${UPLOAD_DEST}/${filename}`;
    const file = await file_service.add(
      original_name,
      filename,
      destination,
      url,
      extension,
      true,
      true,
      request_code,
      null,
    );

    if (file) {
      //#region Generate response
      return await generateUploadFileSuccessResponse(req, file, null);
      //#endregion
    } else {
      //#region throw HandlerException
      throw await generateUploadFileFailedResponse(original_name, null, req);
      //#endregion
    }
  } catch (err) {
    // // Rollback transaction
    // await query_runner.rollbackTransaction();

    console.log('----------------------------------------------------------');
    console.log(req.method + ' - ' + req.url + ': ' + err.message);

    if (err instanceof HttpException) return err;
    else {
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  }
};

export const unlinkFile = async (
  request_code: string,
  file: FileEntity,
  configuration_service: ConfigurationService,
  file_service: FilesService,
  log_service: LogService,
  user_service: UserService,
  data_source: DataSource,
  req: Request,
) => {
  //#region Validate delete file
  const valid = await validateFileUser(
    request_code,
    file.created_by,
    user_service,
    req,
  );
  if (valid instanceof HttpException) throw valid;
  //#endregion

  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();

  // Establish real database connection
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    const success = await file_service.unlink(
      file.id,
      request_code,
      query_runner.manager,
    );

    if (success) {
      //#region Unlink file
      removeFile(file.url, configuration_service, log_service, req);
      //#endregion

      //#region Generate response
      return await generateUploadFileSuccessResponse(req, file, query_runner);
      //#endregion
    } else {
      //#region throw HandlerException
      return await generateUploadFileFailedResponse(
        file.originalName,
        query_runner,
        req,
      );
      //#endregion
    }
  } catch (err) {
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('------------------------------------------------------');
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
