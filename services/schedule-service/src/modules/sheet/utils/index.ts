import { LogService } from '../../log/services/log.service';

import { Crons } from '../constants/enums/crons.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

export const handleLog = (message: string, log_service: LogService) => {
  log_service.writeLog(
    Levels.ERROR,
    Methods.SCHEDULE,
    Crons.UPDATE_SHEETS_STATUS_CRON_JOB,
    message,
  );
};
