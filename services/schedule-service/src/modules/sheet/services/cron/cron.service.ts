import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';

import { catchError, map } from 'rxjs';

import { SheetEntity } from '../../../../entities/sheet.entity';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { SheetService } from '../sheet/sheet.service';
import { LogService } from '../../../log/services/log.service';

import { Configuration } from '../../../shared/constants/configuration.enum';
import { ErrorMessage } from '../../constants/enums/errors.enum';
import { Message } from '../../constants/enums/message.enum';

import { Levels } from 'src/constants/enums/level.enum';
import { Methods } from 'src/constants/enums/method.enum';

import {
  UPDATE_STATUS_SHEETS_CRON_JOB_TIME,
  BACKGROUND_JOB_MODULE,
} from '../../../../constants';

import { SheetPayload } from '../../interfaces/payloads/approval_payload.interface';

let CRON_JOB_TIME = UPDATE_STATUS_SHEETS_CRON_JOB_TIME;

@Injectable()
export class CronService {
  constructor(
    @Inject(BACKGROUND_JOB_MODULE)
    private readonly _backgroundClient: ClientProxy,
    private readonly _configurationService: ConfigurationService,
    private readonly _sheetService: SheetService,
    private _logger: LogService,
  ) {
    CRON_JOB_TIME = this._configurationService.get(
      Configuration.UPDATE_STATUS_SHEETS_CRON_JOB_TIME,
    );
  }

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log('Cron time: ', CRON_JOB_TIME);

      //#region Count Sheets
      const count = await this._sheetService.countSheets();
      //#endregion

      console.log('count: ', count);

      if (count) {
        //#region
        const itemsPerPage = parseInt(
          this._configurationService.get(Configuration.ITEMS_PER_PAGE),
        );

        const pages = Math.ceil(count / itemsPerPage);

        //#endregion

        for (let i = 0; i < pages; i++) {
          const sheets = await this._sheetService.getSheetsPaging(
            i * itemsPerPage,
            itemsPerPage,
          );

          this.send(sheets);
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
    } catch (err) {
      //#region Handle log
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SCHEDULE,
        'CronService.schedule()',
        err,
      );
      //#endregion
    }
  }

  async send(results: SheetEntity[]): Promise<any> {
    return new Promise<any>((resolve) => {
      this._backgroundClient
        .send<any, SheetPayload>(Message.GENERATE_UPDATE_APPROVED_STATUS, {
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
