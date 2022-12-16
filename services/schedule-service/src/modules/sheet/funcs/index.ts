import { HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ApprovalService } from '../services/approval/approval.service';
import { SheetService } from '../services/sheet/sheet.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Crons } from '../constants/enums/crons.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

export const generateUpdateSheets = async (
  approval_service: ApprovalService,
  sheet_service: SheetService,
  data_source: DataSource,
): Promise<boolean | HttpException> => {
  // Make the QueryRunner
  const query_runner = data_source.createQueryRunner();
  await query_runner.connect();

  try {
    // Start transaction
    await query_runner.startTransaction();

    //#region Update sheets status
    let success = await sheet_service.bulkUpdate();
    //#endregion

    //#region Update approval status
    if (success) {
      success = await approval_service.bulkUpdate();
      if (success) return true;
      else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          Pattern.CRON_JOB_PATTERN,
          Crons.UPDATE_SHEETS_STATUS_CRON_JOB,
          ErrorMessage.APPROVALS_OPERATOR_ERROR,
        );
        //#endregion
      }
    } else {
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        Pattern.CRON_JOB_PATTERN,
        Crons.UPDATE_SHEETS_STATUS_CRON_JOB,
        ErrorMessage.SHEETS_OPERATOR_ERROR,
      );
      //#endregion
    }
    //#endregion
  } catch (err) {
    // Rollback transaction
    await query_runner.rollbackTransaction();

    console.log('--------------------------------------------------------');
    console.log(
      Pattern.CRON_JOB_PATTERN +
        ' - ' +
        Crons.UPDATE_SHEETS_STATUS_CRON_JOB +
        ': ' +
        err.message,
    );

    if (err instanceof HttpException) return err;
    else {
      //#region throw HandlerException
      return new HandlerException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        Pattern.CRON_JOB_PATTERN,
        Crons.UPDATE_SHEETS_STATUS_CRON_JOB,
      );
      //#endregion
    }
  } finally {
    // Release transaction
    await query_runner.release();
  }
};
