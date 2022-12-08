import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { unlinkFiles } from '../../funcs';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { FileService } from '../file/file.service';
import { LogService } from '../../../log/services/log.service';

import { generateData2Array } from '../../transform';

import { Configuration } from '../../../shared/constants/configuration.enum';
import { Crons } from '../../constants/enums/crons.enum';
import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

import { ErrorMessage } from '../../constants/enums/errors.enum';

import { UNLINK_FILES_CRON_JOB_TIME } from '../../../../constants';
let CRON_JOB_TIME = UNLINK_FILES_CRON_JOB_TIME;

@Injectable()
export class CronService {
  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _fileService: FileService,
    private _logger: LogService,
  ) {
    CRON_JOB_TIME = this._configurationService.get(
      Configuration.UNLINK_FILES_CRON_JOB_TIME,
    );
  }

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log(`CronJobPattern: /${Crons.UNLINK_FILES_CRON_JOB}`);
      console.log('Cron time: ', CRON_JOB_TIME);

      const files = await this._fileService.getDraftedFiles();
      if (files && files.length > 0) {
        //#region Transform data
        const payload = generateData2Array(files, this._configurationService);
        //#endregion

        //#region Unlink documents
        const success = await unlinkFiles(
          payload,
          this._fileService,
          this._logger,
        );

        if (!success) {
          //#region Handle log
          this._logger.writeLog(
            Levels.ERROR,
            Methods.SCHEDULE,
            Crons.UNLINK_FILES_CRON_JOB,
            ErrorMessage.DRAFTED_FILES_NO_CONTENT_ERROR,
          );
          //#endregion
        }
        //#endregion
      } else {
        //#region Handle log
        this._logger.writeLog(
          Levels.LOG,
          Methods.SCHEDULE,
          Crons.UNLINK_FILES_CRON_JOB,
          ErrorMessage.DRAFTED_FILES_NO_CONTENT_ERROR,
        );
        //#endregion
      }
    } catch (err) {
      //#region Handle log
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SCHEDULE,
        Crons.UNLINK_FILES_CRON_JOB,
        err,
      );
      //#endregion
    }
  }
}
