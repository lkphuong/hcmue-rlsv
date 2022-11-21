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

import { generateResponseTitles } from '../utils';

import { LogService } from '../../../modules/log/services/log.service';

import { TitleService } from '../services/title.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';

import { TitleResponse } from '../interfaces/title-response.interface';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';
import { ErrorMessage } from '../constants/errors.enum';

@Controller('titles')
export class TitleController {
  constructor(
    private readonly _titleService: TitleService,
    private _logger: LogService,
  ) {
    // Due to transient scope, HeaderController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(TitleController.name);
  }

  /**
   * @method GET
   * @url /api/titles/:header_id
   * @access private
   * @description Hiển thị danh sách tiêu chí đánh giá
   * @return HttpResponse<TitleResponse[]> | null | HttpException
   * @page
   */
  @Get('/:header_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getHeadersByFormId(
    @Param('header_id') header_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<TitleResponse[]> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ header_id: header_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ header_id: header_id }),
      );

      //#region Get titles
      const titles = await this._titleService.getTitlesByHeaderId(header_id);
      //#endregion

      if (titles && titles.length > 0) {
        //#region Generate response
        return await generateResponseTitles(titles, req);
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
