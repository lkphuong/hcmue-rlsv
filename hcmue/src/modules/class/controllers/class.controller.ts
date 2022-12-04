import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Param,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';

import { generateClassesResponse } from '../utils';

import { GetClassDto } from '../dtos/get_class.dto';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { ClassResponse } from '../interfaces/class_response.interface';

import { LogService } from '../../log/services/log.service';

import { ClassService } from '../services/class.service';

import { ErrorMessage } from '../constants/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('classes')
export class ClassController {
  constructor(
    private readonly _classService: ClassService,
    private _logger: LogService,
  ) {
    // Due to transient scope, ClassController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(ClassController.name);
  }

  /**
   * @method Get
   * @url /api/classes/all
   * @access private
   * @param department_id
   * @description Hiển thị danh sách lớp theo khoa
   * @return HttpResponse<ClassResponse> | HttpException | null
   * @page Any page
   */
  @Get(':department_id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassesByDepartment(
    @Param() params: GetClassDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ClassResponse> | null | HttpException> {
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
      const { department_id } = params;
      //#endregion

      //#region Get classes
      const $class = await this._classService.getClassesByDepartmentId(
        department_id,
      );
      //#endregion
      if ($class && $class.length > 0) {
        //#region Generate response
        return await generateClassesResponse($class, req);
        //#endregion
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.CLASSES_NO_CONTENT,
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
