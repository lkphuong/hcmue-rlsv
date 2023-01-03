import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import * as config from 'config';

import { sprintf } from '../../../../utils';
import { handleLog } from '../../utils';

import { FormService } from '../../../form/services/form/form.service';
import { SheetService } from '../sheet/sheet.service';
import { LogService } from '../../../log/services/log.service';

import { ErrorMessage } from '../../constants/enums/errors.enum';

import { Crons } from '../../constants/enums/crons.enum';
import { Pattern } from '../../../../constants/enums/pattern.enum';
import { FormStatus } from '../../../form/constants/emuns/form_status.enum';

const CRON_JOB_TIME =
  process.env['GENERATE_CREATE_SHEETS_CRON_JOB_TIME'] ||
  config.get('GENERATE_CREATE_SHEETS_CRON_JOB_TIME');

@Injectable()
export class CronService {
  constructor(
    private readonly _sheetService: SheetService,
    private readonly _formService: FormService,
    private _logger: LogService,
  ) {}

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        `${Pattern.CRON_JOB_PATTERN}: /${Crons.GENERATE_CREATE_SHEETS_CRON_JOB}`,
      );
      console.log('Cron time: ', CRON_JOB_TIME);

      const form = await this._formService.getFormPublished();

      if (form && new Date() >= form.start) {
        //#region Create sheets
        const result = await this._sheetService.generateSheets(
          form.id,
          form.academic_year.id,
          form.semester.id,
        );

        if (result) {
          //#region Update form status: PUBLISHED -> IN_PROGRESS
          const success = await this._formService.updateForm(
            form.id,
            FormStatus.IN_PROGRESS,
          );
          if (!success) {
            //#region Handle log
            handleLog(
              sprintf(
                ErrorMessage.UPDATE_FORM_STATUS_ERROR,
                form.id,
                FormStatus.PUBLISHED,
                FormStatus.IN_PROGRESS,
              ),
              this._logger,
            );
            //#endregion
          }
          //#endregion
        } else {
          //#region Handle log
          handleLog(ErrorMessage.GENERATE_SHEETS_OPERATOR_ERROR, this._logger);
          //#endregion
        }
        //#endregion
      }
    } catch (err) {
      //#region Handle log
      handleLog(err.message, this._logger);
      //#endregion
    }
  }
}
