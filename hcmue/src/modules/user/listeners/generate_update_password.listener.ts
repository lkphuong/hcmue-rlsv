import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { LogService } from '../../log/services/log.service';
import { UserService } from '../services/user.service';

import { EventKey } from '../../shared/constants/event-key.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class GenerateUserUpdateListener {
  constructor(
    private readonly _userService: UserService,
    private readonly _logger: LogService,
  ) {
    // Due to transient scope, GenerateUserUpdateListener has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(GenerateUserUpdateListener.name);
  }

  @OnEvent(EventKey.HCMUE_GENERATE_USER_UPDATE_PASSWORD)
  async generateUpdatePassword(
    source_academic_id: number,
    source_semester_id: number,
    target_academic_id: number,
    targer_semester_id: number,
  ) {
    this._logger.writeLog(
      Levels.LOG,
      Methods.LISTENER,
      EventKey.HCMUE_GENERATE_USER_UPDATE_PASSWORD,
      JSON.stringify({
        source_academic_id: source_academic_id,
        target_academic_id: target_academic_id,
      }),
    );

    if (source_academic_id && target_academic_id) {
      try {
        //#region Update password
        await this._userService.bulkUpdatePassword(
          source_academic_id,
          source_semester_id,
          target_academic_id,
          targer_semester_id,
        );
        //#endregion
      } catch (err) {
        this._logger.writeLog(
          Levels.ERROR,
          Methods.LISTENER,
          EventKey.HCMUE_GENERATE_USER_UPDATE_PASSWORD,
          JSON.stringify({
            error: err.message,
            source_academic_id,
            target_academic_id,
          }),
        );
      }
    }
  }
}
