import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { handleLog } from '../../../utils';
import { generateCreateSheetEntities } from '../funcs';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';
import { SheetService } from '../services/sheet.service';

import { SheetsPayload } from '../interfaces/payloads/sheet_payload.interface';

import { Configuration } from '../../shared/constants/configuration.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';
import { Message } from '../constants/enums/messages.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

import { DATABASE_EXIT_CODE } from '../../../constants/enums/error-code.enum';

@Controller('sheet')
export class SheetController {
  MAX_TIMES = 3;

  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _sheetService: SheetService,
    private _logger: LogService,
  ) {
    this.MAX_TIMES = parseInt(
      this._configurationService.get(Configuration.MAX_TIMES),
    );
  }

  @MessagePattern(Message.GENERATE_CREATE_SHEET)
  async createSheets(
    @Payload() data: SheetsPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const original_message = context.getMessage();

    //#region Handle log
    this._logger.writeLog(
      Levels.LOG,
      Pattern.MESSAGE_PATTERN,
      Message.GENERATE_CREATE_SHEET,
      JSON.stringify({ data }),
    );
    //#endregion

    const { data: items, page } = data.payload;

    console.log('----------------------------------------------------------');
    console.log(
      `${Pattern.MESSAGE_PATTERN}: /${Message.GENERATE_CREATE_SHEET}`,
    );
    console.log('page: ', page);

    try {
      //#region Generate sheet entities
      let sheets = await generateCreateSheetEntities(
        items,
        this._configurationService,
      );
      //#endregion

      //#region Create sheets
      sheets = await this._sheetService.bulkAdd(sheets);
      if (!sheets) {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          Pattern.MESSAGE_PATTERN,
          Message.GENERATE_CREATE_SHEET,
          ErrorMessage.CREATE_SHEETS_ERROR,
        );
        //#endregion
      } else {
        channel.ack(original_message);
      }
      //#endregion
    } catch (err) {
      channel.ack(original_message);

      //#region Handle log
      handleLog(
        Levels.ERROR,
        Pattern.MESSAGE_PATTERN,
        Message.GENERATE_CREATE_SHEET,
        err.message,
        this._logger,
      );
      //#endregion
    }
  }
}
