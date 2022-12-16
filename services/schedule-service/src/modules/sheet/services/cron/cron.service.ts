import { HttpException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

import * as config from 'config';

import { generateUpdateSheets } from '../../funcs';
import { handleLog } from '../../utils';

import { SheetService } from '../sheet/sheet.service';
import { LogService } from '../../../log/services/log.service';

import { ErrorMessage } from '../../constants/enums/errors.enum';

import { Crons } from '../../constants/enums/crons.enum';
import { Pattern } from '../../../../constants/enums/pattern.enum';

import { ApprovalService } from '../approval/approval.service';

const CRON_JOB_TIME =
  process.env['UPDATE_STATUS_SHEETS_CRON_JOB_TIME'] ||
  config.get('UPDATE_STATUS_SHEETS_CRON_JOB_TIME');

@Injectable()
export class CronService {
  constructor(
    private readonly _approvalService: ApprovalService,
    private readonly _sheetService: SheetService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        `${Pattern.CRON_JOB_PATTERN}: /${Crons.UPDATE_SHEETS_STATUS_CRON_JOB}`,
      );
      console.log('Cron time: ', CRON_JOB_TIME);

      //#region Count out of date sheets
      const count = await this._sheetService.countOutOfDateSheets();
      //#endregion

      if (count > 0) {
        //#region Generate update sheets
        const results = await generateUpdateSheets(
          this._approvalService,
          this._sheetService,
          this._dataSource,
        );

        if (results instanceof HttpException) {
          console.log('Lưu thông tin thất bại.');
        } else console.log('Lưu thông tin thành công.');
        //#endregion
      } else {
        //#region Handle log
        handleLog(ErrorMessage.NO_CONTENT_ERROR, this._logger);
        //#endregion
      }
    } catch (err) {
      //#region Handle log
      handleLog(err.message, this._logger);
      //#endregion
    }
  }
}
