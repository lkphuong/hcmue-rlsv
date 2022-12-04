import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { generateResponses } from '../utils';

import { LevelService } from '../services/level.service';
import { LogService } from '../../../modules/log/services/log.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { LevelResponse } from '../interfaces/get-levels-response.interface';

import { ErrorMessage } from '../constants/enums';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('levels')
export class LevelController {
  constructor(
    private readonly _levelService: LevelService,
    private _logger: LogService,
  ) {}

  /**
   * @method GET
   * @url /api/levels
   * @access private
   * @description Hiện thị danh sách xếp loại
   * @return HttpResponse<LevelResponse> | HttpException
   * @page levels page
   */
  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getLevels(
    @Req() req: Request,
  ): Promise<HttpResponse<LevelResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get levels
      const levels = await this._levelService.getLevels();
      //#endregion

      if (levels && levels.length > 0) {
        //#region Generate response
        return await generateResponses(levels, req);
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
    } catch (err) {
      console.log(err);
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
