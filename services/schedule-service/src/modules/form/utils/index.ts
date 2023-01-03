import { LogService } from '../../log/services/log.service';

import { Crons } from '../constants/emuns/crons.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

export const handleLog = (message: string, log_service: LogService) => {
  log_service.writeLog(
    Levels.ERROR,
    Methods.SCHEDULE,
    Crons.GENERATE_UPDATE_FORM_CRON_JOB,
    message,
  );
};
