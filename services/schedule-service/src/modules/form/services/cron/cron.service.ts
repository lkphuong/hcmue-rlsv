import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import * as config from 'config';

import { sprintf } from '../../../../utils';
import { handleLog } from '../../utils';

import { FormService } from '../form/form.service';
import { LogService } from '../../../log/services/log.service';

import { Crons } from '../../constants/emuns/crons.enum';
import { ErrorMessage } from '../../constants/emuns/errors.enum';
import { Pattern } from '../../../../constants/enums/pattern.enum';
import { FormStatus } from '../../constants/emuns/form_status.enum';

const CRON_JOB_TIME =
  process.env['UPDATE_STATUS_FORMS_CRON_JOB_TIME'] ||
  config.get('UPDATE_STATUS_FORMS_CRON_JOB_TIME');

@Injectable()
export class CronService {
  constructor(
    private readonly _formService: FormService,
    private _logger: LogService,
  ) {}

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        `${Pattern.CRON_JOB_PATTERN}: /${Crons.GENERATE_UPDATE_FORM_CRON_JOB}`,
      );
      console.log('Cron time: ', CRON_JOB_TIME);

      const form = await this._formService.getFormInProgress();

      console.log('forms: ', form);

      if (form && new Date() >= form.end) {
        //#region Update form status: IN_PROGRESS -> DONE
        const success = await this._formService.updateForm(
          form.id,
          FormStatus.DONE,
        );
        //#endregion

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
      }
    } catch (err) {
      //#region Handle log
      handleLog(err.message, this._logger);
      //#endregion
    }
  }
}
