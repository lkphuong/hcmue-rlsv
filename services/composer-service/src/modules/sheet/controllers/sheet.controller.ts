import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { handleLog } from '../../../utils';

import { SheetEntity } from '../../../entities/sheet.entity';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';
import { SheetService } from '../services/sheet.service';

import { Configuration } from '../../shared/constants/configuration.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Message } from '../constants/enums/messages.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

import { SPayload } from '../interfaces/payloads/create-sheets-entity.interface';

@Controller('sheet')
export class SheetController {
  MAX_TIMES = 3;

  constructor(
    private _configurationService: ConfigurationService,
    private _sheetService: SheetService,
    private _logger: LogService,
  ) {
    this.MAX_TIMES = parseInt(
      this._configurationService.get(Configuration.MAX_TIMES),
    );
  }

  @MessagePattern(Message.GENERATE_CREATE_SHEET_ENTITY)
  async generateCreateSheets(
    @Payload() data: SPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const original_message = context.getMessage();

    //#region Handle log
    this._logger.writeLog(
      Levels.LOG,
      Pattern.MESSAGE_PATTERN,
      Message.GENERATE_CREATE_SHEET_ENTITY,
      JSON.stringify({ data }),
    );
    //#endregion

    console.log('----------------------------------------------------------');
    console.log(
      `${Pattern.MESSAGE_PATTERN}: /${Message.GENERATE_CREATE_SHEET_ENTITY}`,
    );

    const itemsPerPage = parseInt(
      this._configurationService.get(Configuration.ITEMS_PER_PAGE),
    );

    console.log('data: ', data);

    const { data: items } = data.payload;

    try {
      //#region Generate Sheet Entity
      const sheets: SheetEntity[] = [];
      for await (const item of items) {
        const sheet = new SheetEntity();
        sheet.form = item.form;
        sheet.department_id = item.department_id;
        sheet.class_id = item.class_id;
        sheet.k = item.k;
        sheet.semester = item.semester;
        sheet.academic_year = item.academic_year;
        sheet.user_id = item.user_id;
        sheet.level = null;
        sheets.push(sheet);

        if (sheets.length === itemsPerPage || item.flag) {
          break;
        }
      }
      //#endregion

      //#region Compose Sheets
      this._sheetService.send(Message.GENERATE_CREATE_SHEET, sheets);
      //#endregion

      channel.ack(original_message);
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
