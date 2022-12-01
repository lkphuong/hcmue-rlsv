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
import { sprintf } from 'src/utils';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';

import { AcademicYearDto } from '../dtos/academic_year.dto';

import {
  validateAcademicYearHasForm,
  validateAcademicYearId,
  validateDuplicateAcademicYear,
  validateTimeAcademicYear,
} from '../validations';

import { generateData2Array, generateData2Object } from '../transform';

import { LogService } from '../../log/services/log.service';
import { AcademicYearService } from '../services/academic_year.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { AcademicYearResponse } from '../interfaces/academic_year_response.interface';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
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
   * @description Hiển thị danh sách niên khóa
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

  /**
   * @method POST
   * @url /api/academic-years/
   * @access private
   * @param from
   * @param to
   * @description Tạo mới niên khóa
   * @return HttpResponse<AcademicYearResponse> | HttpException
   * @page academic-years
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAcademicYear(
    @Body() params: AcademicYearDto,
    @Req() req: Request,
  ): Promise<HttpResponse<AcademicYearResponse> | HttpException> {
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
      const { from, to } = params;
      //#endregion

      //#region Validation
      let valid: HttpException | null = null;
      //#region  Validate time
      valid = validateTimeAcademicYear(from, to, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#region Validate name
      valid = await validateDuplicateAcademicYear(
        from,
        to,
        this._academicYearService,
        req,
      );
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Create Academic Year
      const academic_service = new AcademicYearEntity();
      academic_service.name = `${from}-${to}`;
      academic_service.active = true;
      academic_service.created_at = new Date();
      academic_service.created_by = user_id;

      const result = await this._academicYearService.add(academic_service);
      //#endregion

      if (result) {
        return {
          data: generateData2Object(result),
          errorCode: 0,
          message: null,
          errors: null,
        };
      } else {
        throw generateFailedResponse(
          req,
          ErrorMessage.OPERATOR_ACADEMIC_YEAR_ERROR,
        );
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
   * @url /api/academic-years/
   * @access private
   * @param id
   * @description Xóa niên khóa
   * @return HttpResponse<AcademicYearResponse> | HttpException
   * @page academic-years
   */
  @Delete(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async unlinkAcademicYear(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<AcademicYearResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url,
        JSON.stringify({ academic_year: id }),
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
      const valid_id = validateAcademicYearId(id, req);
      if (valid_id instanceof HttpException) throw valid_id;
      //#endregion

      //#region Validate academic of form
      const valid = await validateAcademicYearHasForm(
        id,
        this._academicYearService,
        req,
      );
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region  Unlink academic year
      const academic_year = await this._academicYearService.getAcademicYearById(
        id,
      );

      if (academic_year) {
        const result = await this._academicYearService.unlink(id, user_id);
        if (result) {
          return {
            data: generateData2Object(academic_year),
            errorCode: 0,
            message: null,
            errors: null,
          };
        } else {
          throw generateFailedResponse(
            req,
            ErrorMessage.OPERATOR_ACADEMIC_YEAR_ERROR,
          );
        }
      } else {
        //#region throw HandleException
        throw new UnknownException(
          id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.ACADEMIC_YEAR_NOT_FOUND_ERROR, id),
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
