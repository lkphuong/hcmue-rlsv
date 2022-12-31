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

import { createSemester, unlinkSemester } from '../funcs';
import { generateSemestersResponse } from '../utils';
import {
  validateDateAcademic,
  isUsed,
  validateId,
  validateTime,
} from '../validations/index';

import { SemesterDto } from '../dtos/semester.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { LogService } from '../../log/services/log.service';
import { SemesterService } from '../services/semester.service';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  CreateSemesterResponse,
  SemesterResponse,
} from '../interfaces/semester_response.interface';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { Role } from '../../auth/constants/enums/role.enum';
import { Levels } from '../../../constants/enums/level.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('semesters')
export class SemesterController {
  constructor(
    private readonly _academicService: AcademicYearService,
    private readonly _semesterService: SemesterService,
    private _logger: LogService,
  ) {}

  /**
   * @method GET
   * @url /api/semesters
   * @access private
   * @description Hiển thị danh sách học kỳ
   * @return HttpResponse<SemesterResponse> | HttpException | null
   * @page semesters page
   */
  @Get('/')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSemesters(
    @Req() req: Request,
  ): Promise<HttpResponse<SemesterResponse> | HttpException | null> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get semesters
      const semesters = await this._semesterService.getSemesters();
      //#endregion

      if (semesters && semesters.length > 0) {
        //#region Generate response
        return generateSemestersResponse(semesters, req);
        //#endregion
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
   * @page semesters page
   */
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createSemester(
    @Body() params: SemesterDto,
    @Req() req: Request,
  ): Promise<HttpResponse<CreateSemesterResponse> | HttpException> {
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { academic_id, end, start } = params;
      //#endregion

      //#region Validation
      //#region Validate academic_id
      let valid = await validateId(academic_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate time
      valid = validateTime(start, end, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate date academic
      valid = await validateDateAcademic(
        academic_id,
        start,
        end,
        this._academicService,
        req,
      );
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Create semester
      const result = await createSemester(
        params,
        request_code,
        this._semesterService,
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
   * @url /api/semesters/:id
   * @access private
   * @param id
   * @description Xóa học kì
   * @return HttpResponse<SemesterResponse> | HttpException
   * @page semesters page
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async unlinkSemester(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<CreateSemesterResponse> | HttpException> {
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
        JSON.stringify({ semester_id: id }),
      );

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate semester_id
      let valid = validateId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate check if semester has used in any form
      valid = await isUsed(id, this._semesterService, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Unlink semester
      const result = await unlinkSemester(
        id,
        request_code,
        this._semesterService,
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
