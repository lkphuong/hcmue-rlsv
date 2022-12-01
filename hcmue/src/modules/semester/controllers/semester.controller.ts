import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { generateFailedResponse } from '../utils';
import { sprintf } from '../../../utils';

import { SemesterEntity } from '../../../entities/semester.entity';

import {
  validateDuplicateSemester,
  validateSemesterHasForm,
  validateSemesterId,
} from '../validations/index';

import { LogService } from '../../log/services/log.service';
import { SemesterService } from '../services/semester.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { generateData2Array, generateData2Object } from '../transform';

import { SemesterDto } from '../dtos/semester.dto';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { SemesterResponse } from '../interfaces/semester_response.interface';
import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
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
   * @page semesters
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

  /**
   * @method POST
   * @url /api/semesters/
   * @access private
   * @param name
   * @description Tạo mới học kì
   * @return HttpResponse<SemesterResponse> | HttpException
   * @page semesters
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createSemester(
    @Body() params: SemesterDto,
    @Req() req: Request,
  ): Promise<HttpResponse<SemesterResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ' - ' + null);

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params: params }),
      );

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { name } = params;
      //#endregion

      //#region validation
      const valid = await validateDuplicateSemester(
        name,
        this._semesterService,
        req,
      );
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Create Semester
      const semester = new SemesterEntity();
      semester.name = name;
      semester.active = true;
      semester.created_at = new Date();
      semester.created_by = user_id;

      const result = await this._semesterService.add(semester);
      //#endregion

      if (result) {
        return {
          data: generateData2Object(result),
          errorCode: 0,
          message: null,
          errors: null,
        };
      } else {
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

  /**
   * @method DELETE
   * @url /api/semesters/:id
   * @access private
   * @param id
   * @description Xóa học kì
   * @return HttpResponse<SemesterResponse> | HttpException
   * @page semesters
   */
  @Delete(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async unlinkSemester(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<SemesterResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url,
        JSON.stringify({ semester_id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ academic_year: id }),
      );

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate ID
      const valid_id = validateSemesterId(id, req);
      if (valid_id instanceof HttpException) throw valid_id;
      //#endregion

      //#region Validate semester of form
      const valid = await validateSemesterHasForm(
        id,
        this._semesterService,
        req,
      );
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Unlink semester
      const semester = await this._semesterService.getSemesterById(id);
      if (semester) {
        const result = await this._semesterService.unlink(id, user_id);
        if (result) {
          return {
            data: generateData2Object(semester),
            errorCode: 0,
            message: null,
            errors: null,
          };
        } else {
          throw generateFailedResponse(
            req,
            ErrorMessage.OPERATOR_SEMESTER_ERROR,
          );
        }
      } else {
        //#region throw HandleException
        throw new UnknownException(
          id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.SEMESTER_NOT_FOUND_ERROR, id),
        );
        //#endregion
      }
      //#endregion
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
