import { Controller, HttpException } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { handleLog } from '../../../utils';
import { generateResponse } from '../utils';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';
import { SheetService } from '../services/sheet.service';

import { Configuration } from '../../shared/constants/configuration.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Message } from '../constants/enums/messages.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

import { GenerateCreateSheetsResponse } from '../interfaces/responses/create-sheets-response.interface';
import { SheetEntityPayload } from '../interfaces/payloads/create-sheets.interface';
import { SheetEntity } from 'src/entities/sheet.entity';

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

  @MessagePattern(Message.GENERATE_CREATE_SHEET)
  async createSheets(
    @Payload() data: SheetEntityPayload,
    @Ctx() context: RmqContext,
  ): Promise<GenerateCreateSheetsResponse> {
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

    console.log('----------------------------------------------------------');
    console.log(
      `${Pattern.MESSAGE_PATTERN}: /${Message.GENERATE_CREATE_SHEET}`,
    );
    console.log('data: ', data);

    const { data: items } = data.payload;

    try {
      items.map((data) => {
        const sheet = new SheetEntity();
        Object.assign(sheet, data);
        return sheet;
      });

      const sheets = await this._sheetService.bulkAdd(items);

      if (sheets instanceof HttpException) {
        channel.ack(original_message);
        throw sheets;
      } else {
        channel.ack(original_message);

        //#region Generate response
        return await generateResponse(sheets, true);
        //#endregion
      }
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

      //#region Generate response
      return await generateResponse(null, false);
      //#endregion
    }
  }
}
