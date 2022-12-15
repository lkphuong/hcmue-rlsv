import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { handleLog } from '../../../utils';
import { generateApproval2Array, generateSheet2Array } from '../transform';

import { ApprovalEntity } from '../../../entities/approval.entity';
import { SheetEntity } from '../../../entities/sheet.entity';

import { ApprovalService } from '../../approval/services/approval.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';
import { SheetService } from '../services/sheet.service';

import { ApprovalPayload } from '../interfaces/payloads/approval_payload.interface';

import { Configuration } from '../../shared/constants/configuration.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Message } from '../constants/enums/messages.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

@Controller('sheet')
export class SheetController {
  MAX_TIMES = 3;

  constructor(
    private readonly _approvalService: ApprovalService,
    private readonly _configurationService: ConfigurationService,
    private readonly _sheetService: SheetService,
    private _logger: LogService,
  ) {
    this.MAX_TIMES = parseInt(
      this._configurationService.get(Configuration.MAX_TIMES),
    );
  }

  /**
   * @description: Cập nhật trạng thái phiếu khi quá hạn
   */
  @MessagePattern(Message.GENERATE_UPDATE_APPROVED_STATUS)
  async setSheetsStatus(
    @Payload() data: ApprovalPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const original_message = context.getMessage();

    //#region Handle log
    this._logger.writeLog(
      Levels.LOG,
      Pattern.MESSAGE_PATTERN,
      Message.GENERATE_UPDATE_APPROVED_STATUS,
      JSON.stringify(data),
    );
    //#endregion

    //#region Get params
    const { data: items } = data.payload;
    //#endregion

    console.log('----------------------------------------------------------');
    console.log(
      `${Pattern.MESSAGE_PATTERN}: /${Message.GENERATE_UPDATE_APPROVED_STATUS}`,
    );
    console.log('data: ', data);

    try {
      let results: ApprovalEntity[] | SheetEntity[] | null = null;

      //#region Update approvals
      const approvals = await generateApproval2Array(items);
      results = await this._approvalService.bulkUpdate(approvals);
      //#endregion

      if (results) {
        //#region Update sheets
        const sheets = await generateSheet2Array(items);
        results = await this._sheetService.bulkUpdate(sheets);
        if (!results) {
          channel.ack(original_message);

          //#region Handle log
          handleLog(
            Levels.ERROR,
            Pattern.MESSAGE_PATTERN,
            Message.GENERATE_UPDATE_APPROVED_STATUS,
            ErrorMessage.UPDATE_SHEET_ERROR,
            this._logger,
          );
          //#endregion
        } else channel.ack(original_message);
        //#endregion
      } else {
        channel.ack(original_message);

        //#region Handle log
        handleLog(
          Levels.ERROR,
          Pattern.MESSAGE_PATTERN,
          Message.GENERATE_UPDATE_APPROVED_STATUS,
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
