import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

import { generateResponseHeaders } from '../utils';

import { LogService } from '../../../modules/log/services/log.service';

import { HeaderService } from '../services/header.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';

import { HeaderResponse } from '../interfaces/header-response.interface';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';
import { ErrorMessage } from '../constants/errors.enum';

@Controller('headers')
export class HeaderController {
  constructor(
    private readonly _headerService: HeaderService,
    private _logger: LogService,
  ) {
    // Due to transient scope, HeaderController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(HeaderController.name);
  }

  /**
   * @method GET
   * @url /api/headers/:form_id
   * @access private
   * @description Hiển thị danh sách hạng mục đánh giá
   * @return HttpResponse<Class[]> | null | HttpException
   * @page
   */
  @Get('/:form_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getHeadersByFormId(
    @Param('form_id') form_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<HeaderResponse[]> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ form_id: form_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: form_id }),
      );

      //#region Get headers
      const headers = await this._headerService.getHeadersByFormId(form_id);
      //#endregion

      if (headers && headers.length > 0) {
        //#region Generate response
        return await generateResponseHeaders(headers, req);
        //#endregion
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
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
