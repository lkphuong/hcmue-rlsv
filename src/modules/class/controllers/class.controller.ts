import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';

import { Request } from 'express';

import { GetClassDto } from '../dtos/get_class.dto';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { ClassResponse } from '../interfaces/class_response.interface';

import { LogService } from '../../log/services/log.service';
import { ClassService } from '../services/class.service';
import { AcademicYearService } from 'src/modules/academic-year/services/academic_year.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { generateAcademicYearClass2Array } from '../transform';

import { Levels } from '../../../constants/enums/level.enum';

import { ErrorMessage } from '../constants/errors.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('classes')
export class ClassController {
  constructor(
    private readonly _classService: ClassService,
    private readonly _academicYearService: AcademicYearService,
    private _logger: LogService,
  ) {
    // Due to transient scope, ClassController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(ClassController.name);
  }

  /**
   * @method POST
   * @url /api/classes/all
   * @access private
   * @description danh sách lớp theo khoa
   * @return HttpResponse<Class[]> | null | HttpException
   * @page
   */
  @Post('all')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassesByDepartment(
    @Body() params: GetClassDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ClassResponse[]> | null | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Get params
      const { academic_year_id, department_id } = params;
      //#endregion

      const academic_year =
        await this._academicYearService.getAcademicYearClassesById(
          academic_year_id,
        );

      if (academic_year) {
        if (
          academic_year.academic_year_classes &&
          academic_year.academic_year_classes.length > 0
        ) {
          const classes = await generateAcademicYearClass2Array(
            department_id,
            academic_year,
            this._classService,
          );

          if (classes && classes.length > 0) {
            return {
              data: classes,
              errorCode: 0,
              message: null,
              errors: null,
            };
          }
        }
      }
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.CLASSES_NO_CONTENT,
        HttpStatus.NOT_FOUND,
      );
      //#endregion
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
