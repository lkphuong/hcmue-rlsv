import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { SemesterResponse } from '../interfaces/semester_response.interface';

import { LogService } from '../../log/services/log.service';

import { SemesterService } from '../services/semester.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { generateData2Array } from '../transform';

import { Levels } from '../../../constants/enums/level.enum';

import { ErrorMessage } from '../constants/errors.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('semesters')
export class SemesterController {
  constructor(
    private readonly _semesterService: SemesterService,
    private _logger: LogService,
  ) {}

  /**
   * @method GET
   * @url /api/classes/:department_id
   * @access private
   * @description danh sách lớp theo khoa
   * @return HttpResponse<SemesterEntity[]> | null | HttpException
   * @page
   */
  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSemesters(
    @Req() req: Request,
  ): Promise<HttpResponse<SemesterResponse[]> | null | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ' - ' + null);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      const semesters = await this._semesterService.getSemesters();

      if (semesters && semesters.length > 0) {
        return {
          data: generateData2Array(semesters),
          errorCode: 0,
          message: null,
          errors: null,
        };
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.SEMESTERS_NO_CONTENT,
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
