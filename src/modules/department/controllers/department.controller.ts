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

import { Department } from '../../../schemas/department.schema';

import { LogService } from '../../log/services/log.service';
import { DepartmentService } from '../services/department.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { HttpResponse } from '../../../interfaces/http-response.interface';

import { Levels } from '../../../constants/enums/level.enum';

import { ErrorMessage } from '../constants/errors.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly _departmentService: DepartmentService,
    private _logger: LogService,
  ) {
    // Due to transient scope, DepartmentController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(DepartmentController.name);
  }

  /**
   * @Method GET
   * @url /api/departments
   * @access private
   * @description danh sách department từ youth
   * @return
   * @page department
   */
  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getDepartments(
    @Req() req: Request,
  ): Promise<HttpResponse<Department[]> | null> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      const departments = await this._departmentService.getAllDepartments();

      if (departments && departments.length > 0) {
        return {
          data: departments,
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
          ErrorMessage.DEPARTMENTS_NO_CONTENT,
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
