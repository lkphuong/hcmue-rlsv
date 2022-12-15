import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';

import * as config from 'config';

import { handleLog } from '../../utils';
import { send } from '../../funcs';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { SheetService } from '../sheet/sheet.service';
import { LogService } from '../../../log/services/log.service';

import { ErrorMessage } from '../../constants/enums/errors.enum';

import { Configuration } from '../../../shared/constants/configuration.enum';

import { Crons } from '../../constants/enums/crons.enum';
import { Pattern } from '../../../../constants/enums/pattern.enum';

import { BACKGROUND_JOB_MODULE } from '../../../../constants';

const CRON_JOB_TIME =
  process.env['UPDATE_STATUS_SHEETS_CRON_JOB_TIME'] ||
  config.get('UPDATE_STATUS_SHEETS_CRON_JOB_TIME');

@Injectable()
export class CronService {
  constructor(
    @Inject(BACKGROUND_JOB_MODULE)
    private readonly _backgroundClient: ClientProxy,
    private readonly _configurationService: ConfigurationService,
    private readonly _sheetService: SheetService,
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

      //#region Count sheets
      const count = await this._sheetService.countSheets();
      //#endregion

      if (count > 0) {
        //#region Get pages
        const itemsPerPage = parseInt(
          this._configurationService.get(Configuration.ITEMS_PER_PAGE),
        );

        const pages = Math.ceil(count / itemsPerPage);
        //#endregion

        console.log('pages: ', pages);

        //#region Paging
        // for (let i = 0; i < pages; i++) {
        //   const sheets = await this._sheetService.getSheetsPaging(
        //     i * itemsPerPage,
        //     itemsPerPage,
        //   );

        //   console.log(
        //     '----------------------------------------------------------',
        //   );
        //   console.log(
        //     `${Pattern.CRON_JOB_PATTERN}: /${Crons.UPDATE_SHEETS_STATUS_CRON_JOB}`,
        //   );
        //   console.log('sheets: ', sheets.length);
        //   console.log('page: ', i + 1);

        //   send(sheets, this._backgroundClient);
        // }
        //#endregion
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
