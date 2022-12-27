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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { createAcademic, unlinkAcademic } from '../funcs';
import { generateAcademicsResponse } from '../utils';

import {
  isDuplicated,
  isUsed,
  validateAcademicYearId,
  validateYears,
} from '../validations';

import { AcademicYearDto } from '../dtos/academic_year.dto';

import { AcademicYearService } from '../services/academic_year.service';
import { LogService } from '../../log/services/log.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

import { AcademicYearResponse } from '../interfaces/academic_year_response.interface';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { Role } from '../../auth/constants/enums/role.enum';
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
   * @return HttpResponse<AcademicYearResponse> | HttpException | null
   * @page academic-years
   */
  @Get('/')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getAcademicYears(
    @Req() req: Request,
  ): Promise<HttpResponse<AcademicYearResponse> | HttpException | null> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get academic-years
      const academic_years = await this._academicYearService.getAcademicYears();
      //#endregion

      if (academic_years && academic_years.length > 0) {
        //#region Generate response
        return generateAcademicsResponse(academic_years, req);
        //#endregion
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
   * @page academic-years page
   */
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAcademic(
    @Body() params: AcademicYearDto,
    @Req() req: Request,
  ): Promise<HttpResponse<AcademicYearResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ' - ' + JSON.stringify(params),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { from, to } = params;
      //#endregion

      //#region Validation
      //#region  Validate years
      let valid = validateYears(from, to, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate name
      valid = await isDuplicated(from, to, this._academicYearService, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Create academic-year
      const result = await createAcademic(
        from,
        to,
        user_id,
        this._academicYearService,
        req,
      );

      //#region Generate response
      if (result instanceof HttpException) throw result;
      else return result;
      //#endregion
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

  /**
   * @method DELETE
   * @url /api/academic-years/
   * @access private
   * @param id
   * @description Xóa niên khóa
   * @return HttpResponse<AcademicYearResponse> | HttpException
   * @page academic-years page
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async unlinkAcademic(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<AcademicYearResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url,
        JSON.stringify({ academic_id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ academic_id: id }),
      );

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate academic_id
      let valid = validateAcademicYearId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate check if academic-year has used in any form
      valid = await isUsed(id, this._academicYearService, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region  Unlink academic-year
      const result = await unlinkAcademic(
        id,
        user_id,
        this._academicYearService,
        req,
      );

      //#region Generate response
      if (result instanceof HttpException) throw result;
      else return result;
      //#endregion
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
