import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { Request } from 'express';

import { generateStatusResponse } from '../utils';

import { LogService } from '../../log/services/log.service';
import { StatusService } from '../services/status.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { StatusResponse } from '../interfaces/status_response.interface';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Roles } from '../../auth/decorators/roles.decorator';

import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/error.enum';

@Controller('statuses')
export class StatusController {
  constructor(
    private readonly _statusService: StatusService,
    private _logger: LogService,
  ) {}

  /**
   * @method GET
   * @url api/statuses
   * @access private
   * @description Hiển thị danh sách trạng thái sinh viên
   * @return HttpResponse<StatusResponse> | nul
   * @page roles page
   */
  @Get()
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getStatuses(
    @Req() req: Request,
  ): Promise<HttpResponse<StatusResponse> | null> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + '');

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      const statuses = await this._statusService.getStatuses();
      if (statuses && statuses.length > 0) {
        return generateStatusResponse(statuses, req);
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.NO_CONTENT,
          HttpStatus.NOT_FOUND,
        );
        //#endregion
      }
    } catch (err) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + err.message);
      if (err instanceof HttpException) throw err;
      else {
        throw new HandlerException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
        );
      }
    }
  }
}
