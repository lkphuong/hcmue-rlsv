import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices/client';

import * as config from 'config';

import { generateSheet2Array } from '../../transform';
import { handleLog } from '../../utils';
import { send } from '../../funcs';
import { sprintf } from '../../../../utils';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { FormService } from '../../../form/services/form.service';
import { UserService } from '../user/user.service';
import { LogService } from '../../../log/services/log.service';

import { ErrorMessage } from '../../constants/enums/errors.enum';

import { Configuration } from '../../../shared/constants/configuration.enum';
import { FormStatus } from '../../../form/constants/emuns/form_status.enum';

import { Crons } from '../../constants/enums/crons.enum';
import { Pattern } from '../../../../constants/enums/pattern.enum';

import { COMPOSER_MODULE } from '../../../../constants';

const CRON_JOB_TIME =
  process.env['GENERATE_CREATE_SHEETS_CRON_JOB_TIME'] ||
  config.get('GENERATE_CREATE_SHEETS_CRON_JOB_TIME');

@Injectable()
export class CronService {
  constructor(
    @Inject(COMPOSER_MODULE) private readonly _composerClient: ClientProxy,
    private readonly _configurationService: ConfigurationService,
    private readonly _formService: FormService,
    private readonly _userService: UserService,
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

      const count = await this._userService.countUsers();
      const form = await this._formService.getFormPublished();

      if (count > 0 && form) {
        if (new Date() >= new Date(form.student_start)) {
          //#region Get pages
          const itemsPerPage = parseInt(
            this._configurationService.get(Configuration.ITEMS_PER_PAGE),
          );

          const pages = Math.ceil(count / itemsPerPage);
          //#endregion

          //#region Update form status: PUBLISHED -> IN_PROGRESS
          let success = await this._formService.updateForm(
            form.id,
            FormStatus.IN_PROGRESS,
          );
          //#endregion

          if (success) {
            //#region Paging
            for (let i = 0; i < pages; i++) {
              let flag = false;
              const users = await this._userService.getUsersPaging(
                i * itemsPerPage,
                itemsPerPage,
              );

              if (i + 1 === pages) flag = true;
              const sheets = await generateSheet2Array(form, flag, users);

              console.log(
                '----------------------------------------------------------',
              );
              console.log(
                `${Pattern.CRON_JOB_PATTERN}: /${Crons.GENERATE_CREATE_SHEETS_CRON_JOB}`,
              );
              console.log('Cron time: ', CRON_JOB_TIME);
              console.log('sheets: ', sheets);

              send(sheets, this._composerClient);
            }
            //#endregion

            //#region Update form status: IN_PROGRESS -> DONE
            success = await this._formService.updateForm(
              form.id,
              FormStatus.DONE,
            );

            if (!success) {
              //#region Handle log
              handleLog(
                sprintf(
                  ErrorMessage.UPDATE_FORM_STATUS_ERROR,
                  form.id,
                  FormStatus.IN_PROGRESS,
                  FormStatus.DONE,
                ),
                this._logger,
              );
              //#endregion
            }
            //#endregion
          } else {
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
      } else {
        //#region Handle log
        handleLog(ErrorMessage.NO_CONTENT, this._logger);
        //#endregion
      }
    } catch (err) {
      //#region Handle log
      handleLog(err.message, this._logger);
      //#endregion
    }
  }
}
