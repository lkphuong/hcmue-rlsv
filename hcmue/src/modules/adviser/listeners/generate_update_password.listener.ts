import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { LogService } from '../../log/services/log.service';
import { AdviserService } from '../services/adviser/adviser.service';

import { EventKey } from '../../shared/constants/event-key.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class GenerateAdviserUpdateListener {
  constructor(
    private readonly _adviserService: AdviserService,
    private readonly _logger: LogService,
  ) {
    // Due to transient scope, GenerateAdviserUpdateListener has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(GenerateAdviserUpdateListener.name);
  }

  @OnEvent(EventKey.HCMUE_GENERATE_ADVISER_UPDATE_PASSWORD)
  async generateUpdatePassword(
    source_academic_id: number,
    target_academic_id: number,
  ) {
    this._logger.writeLog(
      Levels.LOG,
      Methods.LISTENER,
      EventKey.HCMUE_GENERATE_ADVISER_UPDATE_PASSWORD,
      JSON.stringify({
        source_academic_id: source_academic_id,
        target_academic_id: target_academic_id,
      }),
    );

    if (source_academic_id && target_academic_id) {
      try {
        //#region Update password
        await this._adviserService.bulkUpdatePassword(
          source_academic_id,
          target_academic_id,
        );
        //#endregion
      } catch (err) {
        this._logger.writeLog(
          Levels.ERROR,
          Methods.LISTENER,
          EventKey.HCMUE_GENERATE_ADVISER_UPDATE_PASSWORD,
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
