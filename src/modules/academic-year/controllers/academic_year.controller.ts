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

import { LogService } from '../../log/services/log.service';
import { AcademicYearService } from '../services/academic_year.service';

import { generateData2Array } from '../transform';

import { HandlerException } from '../../../exceptions/HandlerException';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { AcademicYearResponse } from '../interfaces/academic_year_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { ErrorMessage } from '../constants/errors.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('academic-years')
export class AcademicYearController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private _logger: LogService,
  ) {
    // Due to transient scope, AcademicYearController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(AcademicYearController.name);
  }

  /**
   * @method GET
   * @url /api/academic-years/
   * @access private
   * @description hiển thị danh sách niên khóa
   * @return HttpResponse<SemesterEntity[]> | null | HttpException
   * @page academic-years
   */
  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getAcademicYears(
    @Req() req: Request,
  ): Promise<HttpResponse<AcademicYearResponse[]> | null | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ' - ' + null);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      const academic_years = await this._academicYearService.getAcademicYears();

      if (academic_years && academic_years.length > 0) {
        return {
          data: generateData2Array(academic_years),
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
          ErrorMessage.ACADEMIC_YEARS_NO_CONTENT,
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
