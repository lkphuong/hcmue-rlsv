import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ClientProxy } from '@nestjs/microservices/client';

import { catchError, map } from 'rxjs';

import { generateSheet2Array } from '../../transform';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { FormService } from '../../../form/services/form.service';
import { UserService } from '../user/user.service';
import { LogService } from '../../../log/services/log.service';

import { Configuration } from '../../../shared/constants/configuration.enum';
import { ErrorMessage } from '../../constants/enums/errors.enum';
import { Message } from '../../constants/enums/message.enum';

import { Levels } from 'src/constants/enums/level.enum';
import { Methods } from 'src/constants/enums/method.enum';

import {
  GENERATE_CREATE_SHEETS_CRON_JOB_TIME,
  COMPOSER_MODULE,
} from '../../../../constants';
import {
  SheetPayload,
  SPayload,
} from '../../interfaces/payloads/sheet_payload.interface';
import { FormStatus } from '../../../form/constants/emuns/form_status.enum';

let CRON_JOB_TIME = GENERATE_CREATE_SHEETS_CRON_JOB_TIME;

@Injectable()
export class CronService {
  constructor(
    @Inject(COMPOSER_MODULE) private readonly _composerClient: ClientProxy,
    private readonly _configurationService: ConfigurationService,
    private readonly _formService: FormService,
    private readonly _userService: UserService,

    private _logger: LogService,
  ) {
    CRON_JOB_TIME = this._configurationService.get(
      Configuration.GENERATE_CREATE_SHEETS_CRON_JOB_TIME,
    );
  }

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log('Cron time: ', CRON_JOB_TIME);

      const count = await this._userService.countUsers();
      const form = await this._formService.getFormPublished();

      if (new Date() > new Date(form.student_start)) {
        if (count && form) {
          //#region
          const itemsPerPage = parseInt(
            this._configurationService.get(Configuration.ITEMS_PER_PAGE),
          );

          const pages = Math.ceil(count / itemsPerPage);
          //#endregion

          //#region Update Form PUBLISHED -> IN_PROGRESS
          let success = await this._formService.updateForm(
            form.id,
            FormStatus.IN_PROGRESS,
          );
          //#endregion

          if (success) {
            for (let i = 0; i < pages; i++) {
              const users = await this._userService.getUsersPaging(
                i * itemsPerPage,
                itemsPerPage,
              );

              let flag = false;
              if (i + 1 === pages) {
                flag = true;
              }
              const results = await generateSheet2Array(form, flag, users);
              this.send(results);
            }

            //#region Update Form IN_PROGRESS -> DONE
            success = await this._formService.updateForm(
              form.id,
              FormStatus.DONE,
            );
            //#endregion
          }
        } else {
          //#region Handle log
          this._logger.writeLog(
            Levels.ERROR,
            Methods.SCHEDULE,
            'CronService.schedule()',
            ErrorMessage.NO_CONTENT,
          );
          //#endregion
        }
      }
    } catch (e) {
      //#region Handle log
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SCHEDULE,
        'CronService.schedule()',
        e,
      );
      //#endregion
    }
  }

  async send(results: SheetPayload[]): Promise<any> {
    return new Promise<any>((resolve) => {
      this._composerClient
        .send<any, SPayload>(Message.GENERATE_CREATE_SHEET_ENTITY, {
          payload: {
            data: results,
          },
        })
        .pipe(
          map((results) => {
            return results;
          }),
          catchError(() => {
            return null;
          }),
        )
        .subscribe((result) => resolve(result));
    });
  }
}
