import {
  Controller,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Post,
  Body,
} from '@nestjs/common';
import { Request } from 'express';

import { generateClassesResponse } from '../utils';

import { GetClassDto } from '../dtos/get_class.dto';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';
import { ClassResponse } from '../interfaces/class_response.interface';

import { LogService } from '../../log/services/log.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { ClassService } from '../services/class.service';

import { ErrorMessage } from '../constants/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { Configuration } from '../../shared/constants/configuration.enum';
@Controller('classes')
export class ClassController {
  constructor(
    private readonly _classService: ClassService,
    private readonly _configurationService: ConfigurationService,
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
   * @param department_id
   * @description Hiển thị danh sách lớp theo khoa
   * @return HttpResponse<ClassResponse> | HttpException | null
   * @page Any page
   */
  @Post('all')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassesByDepartment(
    @Body() params: GetClassDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ClassResponse> | null | HttpException> {
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
      const { department_id, page } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      if (pages === 0) {
        //#region Get pages
        const count = await this._classService.count(department_id);
        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
        console.log('count: ', count);
      }

      //#region Get classes
      const classes = await this._classService.getClassesByDepartmentId(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        department_id,
      );

      console.log('class: ', classes);
      //#endregion
      if (classes && classes.length > 0) {
        //#region Generate response
        return generateClassesResponse(pages, page, classes, req);
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
