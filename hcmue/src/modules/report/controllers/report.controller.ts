import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import {
  generateReportsDepartmentResponse,
  generateReportsResponse,
} from '../utils';
import {
  validateAcademicYear,
  validateClass,
  validateDepartment,
  validateRole,
  validateSemester,
} from '../validations';

import { GetReportsByClassDto } from '../dtos/get_reports_by_class.dto';
import { GetReportsByDepartmentDto } from '../dtos/get_reports_by_department.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { CacheClassService } from '../services/cache-class.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { LevelService } from '../../level/services/level.service';
import { LogService } from '../../log/services/log.service';
import { SemesterService } from '../../semester/services/semester.service';
import { SheetService } from '../../sheet/services/sheet.service';
import { UserService } from '../../user/services/user.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  ReportDepartmentsResponse,
  ReportResponse,
} from '../interfaces/report-response.interface';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Roles } from '../../auth/decorators/roles.decorator';

import { Levels } from '../../../constants/enums/level.enum';

import { Role } from '../../auth/constants/enums/role.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _cacheClassService: CacheClassService,
    private readonly _classService: ClassService,
    private readonly _departmentService: DepartmentService,
    private readonly _levelService: LevelService,
    private readonly _semesterService: SemesterService,
    private readonly _sheetService: SheetService,
    private readonly _userService: UserService,
    private _logger: LogService,
  ) {
    // Due to transient scope, ReportController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(ReportController.name);
  }

  /**
   * @method POST
   * @url /api/reports/class
   * @access private
   * @param academic_id
   * @param semester_id
   * @param department_id
   * @param class_id?
   * @description Hiển thị thống kê phiếu
   * @return HttpResponse<ReportResponse> | HttpException | null
   * @page reports page
   */
  @Post('/class')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getReportsByClass(
    @Body() params: GetReportsByClassDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ReportResponse> | HttpException> {
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
      const { academic_id, semester_id, department_id, class_id } = params;
      //#endregion

      //#region Get Jwt Payload
      const { role, user_id } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate academic-year
      const academic = await validateAcademicYear(
        academic_id,
        this._academicYearService,
        req,
      );

      if (academic instanceof HttpException) throw academic;
      //#endregion

      //#region Validate department
      const department = await validateDepartment(
        department_id,
        this._departmentService,
        req,
      );

      if (department instanceof HttpException) throw department;
      //#endregion

      //#region Validate class
      const classes = await validateClass(class_id, this._classService, req);

      if (classes instanceof HttpException) throw classes;
      //#endregion

      //#region Validate semester
      const semester = await validateSemester(
        semester_id,
        this._semesterService,
        req,
      );

      if (semester instanceof HttpException) throw semester;
      //#endregion

      //#region Validate role
      const valid = await validateRole(
        department_id,
        role,
        user_id,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Get levels
      const levels = await this._levelService.getLevels();
      //#endregion

      //#region Get reports
      const cache_classes = await this._cacheClassService.getCacheClasses(
        academic_id,
        department_id,
        semester_id,
        class_id,
      );
      //#endregion

      if (cache_classes && cache_classes.length > 0) {
        //#region Generate response
        return await generateReportsResponse(
          academic,
          department,
          semester,
          academic_id,
          class_id,
          department_id,
          semester_id,
          cache_classes,
          levels,
          this._classService,
          this._sheetService,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.NO_CONTENT,
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
   * @url api/reports
   * @param academic_id
   * @param semester_id
   * @param department_id?
   * @descripion hiển thị thống kế phiếu của các khoa
   * @return HttpResponse<ReportResponse> | HttpException | null
   * @page reports page
   */
  @Post('/')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getReports(
    @Body() params: GetReportsByDepartmentDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ReportDepartmentsResponse> | HttpException> {
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
      const { academic_id, department_id, semester_id } = params;
      //#endregion

      //#region Validation
      //#region  Validate academic year
      const academic = await validateAcademicYear(
        academic_id,
        this._academicYearService,
        req,
      );
      if (academic instanceof HttpException) throw academic;
      //#endregion

      //#region Validate semester
      const semester = await validateSemester(
        semester_id,
        this._semesterService,
        req,
      );
      if (semester instanceof HttpException) throw semester;
      //#endregion

      //#region Validate department
      const department = await validateDepartment(
        department_id,
        this._departmentService,
        req,
      );
      if (department instanceof HttpException) throw department;
      //#endregion
      //#endregion

      //#region Get levels
      const levels = await this._levelService.getLevels();
      //#endregion

      //#region Get reports
      const cache_classes = await this._cacheClassService.getCacheDepartmes(
        academic_id,
        semester_id,
        department_id,
      );
      //#endregion

      if (cache_classes && cache_classes.length > 0) {
        //#region Generate response
        return await generateReportsDepartmentResponse(
          academic,
          department,
          semester,
          academic_id,
          semester_id,
          cache_classes,
          levels,
          this._departmentService,
          this._sheetService,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.NO_CONTENT,
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
