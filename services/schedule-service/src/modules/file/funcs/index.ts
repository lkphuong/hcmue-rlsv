import * as fs from 'fs';

import { sprintf } from '../../../utils';

import { FileService } from '../services/file/file.service';
import { LogService } from '../../log/services/log.service';

import { FileResponse } from '../interfaces/get-file-response.interface';

import { ErrorMessage } from '../constants/enums/errors.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

export const unlinkFiles = async (
  files: FileResponse[],
  file_service: FileService,
  log_service: LogService,
): Promise<boolean> => {
  for await (const document of files) {
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    } else {
      //#region Handle log
      log_service.writeLog(
        Levels.LOG,
        Methods.SCHEDULE,
        'DocumentModule.funcs.unlinkFiles()',
        sprintf(
          ErrorMessage.FILE_NOT_FOUND_ERROR,
          document.original_name,
          document.path,
        ),
      );
      //#endregion
    }
  }

  return await file_service.bulkUnlink();
};
