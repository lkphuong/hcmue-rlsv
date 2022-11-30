import { Controller, HttpException } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { handleLog } from '../../../utils';
import { generateResponse } from '../utils';

import { SheetEntity } from '../../../entities/sheet.entity';

import { generateApproval2Array, generateSheet2Array } from '../transform';

import { ApprovalService } from '../../approval/services/approval.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';
import { SheetService } from '../services/sheet.service';

import { Configuration } from '../../shared/constants/configuration.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Message } from '../constants/enums/messages.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

import { GenerateCreateSheetsResponse } from '../interfaces/responses/create-sheets-response.interface';
import { SheetEntityPayload } from '../interfaces/payloads/create-sheets.interface';
import { ApprovalEntity } from 'src/entities/approval.entity';
import { ErrorMessage } from '../constants/enums/errors.enum';

@Controller('sheet')
export class SheetController {
  MAX_TIMES = 3;
  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _sheetService: SheetService,
    private readonly _approvalService: ApprovalService,
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

  /**
   * @description: Cập nhật trạng thái khi quá hạn
   */
  @MessagePattern(Message.GENERATE_UPDATE_APPROVED_STATUS)
  async updateStatus(
    @Payload() data: SheetEntityPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const original_message = context.getMessage();

    //#region Handle log
    this._logger.writeLog(
      Levels.LOG,
      Pattern.MESSAGE_PATTERN,
      Message.GENERATE_UPDATE_APPROVED_STATUS,
      JSON.stringify({ data }),
    );
    //#endregion

    console.log('----------------------------------------------------------');
    console.log(
      `${Pattern.MESSAGE_PATTERN}: /${Message.GENERATE_UPDATE_APPROVED_STATUS}`,
    );

    console.log('data: ', data);

    const { data: items } = data.payload;

    try {
      //#region Update approval
      const approvals = await generateApproval2Array(items);

      //#endregion
      let success: ApprovalEntity[] | SheetEntity[] | null = null;
      success = await this._approvalService.bulkUpdate(approvals);
      if (success) {
        const sheets = await generateSheet2Array(items);
        success = await this._sheetService.bulkUpdate(sheets);
        if (!success) {
          channel.ack(original_message);
          //#region Handle log
          handleLog(
            Levels.ERROR,
            Pattern.MESSAGE_PATTERN,
            Message.GENERATE_CREATE_SHEET,
            ErrorMessage.UPDATE_SHEET_ERROR,
            this._logger,
          );
          //#endregion
        }
      } else {
        channel.ack(original_message);
        //#region Handle log
        handleLog(
          Levels.ERROR,
          Pattern.MESSAGE_PATTERN,
          Message.GENERATE_CREATE_SHEET,
          ErrorMessage.UPDATE_APPROVAL_ERROR,
          this._logger,
        );
        //#endregion
      }
    } catch (err) {
      channel.ack(original_message);

      //#region Handle log
      handleLog(
        Levels.ERROR,
        Pattern.MESSAGE_PATTERN,
        Message.GENERATE_UPDATE_APPROVED_STATUS,
        err.message,
        this._logger,
      );
      //#endregion
    }
  }
}
