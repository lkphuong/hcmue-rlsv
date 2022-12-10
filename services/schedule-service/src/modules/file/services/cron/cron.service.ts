import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import * as config from 'config';

import { generateData2Array } from '../../transform';
import { handleLog } from '../../utils';
import { unlinkFiles } from '../../funcs';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { FileService } from '../file/file.service';
import { LogService } from '../../../log/services/log.service';

import { ErrorMessage } from '../../constants/enums/errors.enum';

import { Crons } from '../../constants/enums/crons.enum';
import { Pattern } from '../../../../constants/enums/pattern.enum';

const CRON_JOB_TIME =
  process.env['UNLINK_FILES_CRON_JOB_TIME'] ||
  config.get('UNLINK_FILES_CRON_JOB_TIME');

@Injectable()
export class CronService {
  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _fileService: FileService,
    private _logger: LogService,
  ) {}

  @Cron(CRON_JOB_TIME)
  async schedule() {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        `${Pattern.CRON_JOB_PATTERN}: /${Crons.UNLINK_FILES_CRON_JOB}`,
      );
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
          handleLog(ErrorMessage.UNLINK_DRAFTED_FILES_ERROR, this._logger);
          //#endregion
        }
        //#endregion
      } else {
        //#region Handle log
        handleLog(ErrorMessage.DRAFTED_FILES_NO_CONTENT_ERROR, this._logger);
        //#endregion
      }
    } catch (err) {
      //#region Handle log
      handleLog(err.message, this._logger);
      //#endregion
    }
  }
}
