import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  StreamableFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';

import * as fs from 'fs';
import { join } from 'path';

import {
  exportExcelTemplateAdmin,
  exportExcelTemplateClass,
  exportExcelTemplateDepartment,
  exportWordTemplateAdmin,
  exportWordTemplateClass,
  exportWordTemplateDepartment,
} from '../funcs';

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
import { ExportReportsDto } from '../dtos/export_excel.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { CacheClassService } from '../services/cache-class.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { HttpService } from '@nestjs/axios/dist';
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
  UNKNOW_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import {
  FILE_NAME_TEMPLATE,
  PATH_FILE_EXCEL,
} from '../constants/enums/template.enum';
import { Configuration } from '../../shared/constants/configuration.enum';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _cacheClassService: CacheClassService,
    private readonly _configurationService: ConfigurationService,
    private readonly _httpService: HttpService,
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

      // //#region Validate role
      // const valid = await validateRole(
      //   department_id,
      //   role,
      //   user_id,
      //   this._userService,
      //   req,
      // );

      // if (valid instanceof HttpException) throw valid;
      // //#endregion
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
          this._cacheClassService,
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
   * @url /api/reports/class
   * @access private
   * @param academic_id
   * @param semester_id
   * @param department_id
   * @param class_id?
   * @description Export thống kê phiếu cấp lớp
   * @return File word
   * @page reports page
   */
  @Post('/class/export/word')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async exportReportsByClass(
    @Body() params: GetReportsByClassDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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

      // //#region Validate role
      // const valid = await validateRole(
      //   department_id,
      //   role,
      //   user_id,
      //   this._userService,
      //   req,
      // );

      // if (valid instanceof HttpException) throw valid;
      // //#endregion
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
      const RESOURCE_FOLDER = this._configurationService.get(
        Configuration.RESOURCE_FOLDER,
      );
      if (cache_classes && cache_classes.length > 0) {
        //#region Generate response
        const result = await exportWordTemplateClass(
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
          this._configurationService,
          this._sheetService,
          req,
        );

        if (result) {
          const file = fs.createReadStream(
            join(
              process.cwd(),
              RESOURCE_FOLDER + FILE_NAME_TEMPLATE.TEMPLATE_1,
            ),
          );

          console.log(
            fs.existsSync(
              join(
                process.cwd(),
                RESOURCE_FOLDER + FILE_NAME_TEMPLATE.TEMPLATE_1,
              ),
            ),
          );

          res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=report.docx`,
            'Access-Control-Expose-Headers': '*',
          });

          const file_2 = new StreamableFile(file);

          console.log(file_2);

          return file_2;
        } else {
          //#region throw HandlerException
          throw new HandlerException(
            UNKNOW_EXIT_CODE.UNKNOW_ERROR,
            req.method,
            req.url,
            ErrorMessage.EXPORT_FILE_OPERATOR,
            HttpStatus.EXPECTATION_FAILED,
          );
          //#endregion
        }
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
   * @url /api/reports/class
   * @access private
   * @param academic_id
   * @param semester_id
   * @param department_id
   * @param class_id?
   * @description Export thống kê phiếu cấp khoa
   * @return File word
   * @page reports page
   */
  @Post('/department/export/word')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async exportReportsByDeparment(
    @Body() params: GetReportsByClassDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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

      // //#region Validate role
      // const valid = await validateRole(
      //   department_id,
      //   role,
      //   user_id,
      //   this._userService,
      //   req,
      // );

      // if (valid instanceof HttpException) throw valid;
      // //#endregion
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
        const result = await exportWordTemplateDepartment(
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
          this._configurationService,
          this._sheetService,
          req,
        );

        const RESOURCE_FOLDER = this._configurationService.get(
          Configuration.RESOURCE_FOLDER,
        );

        if (result) {
          const file = fs.createReadStream(
            join(
              process.cwd(),
              RESOURCE_FOLDER + FILE_NAME_TEMPLATE.TEMPLATE_2,
            ),
          );

          console.log(
            fs.existsSync(
              join(
                process.cwd(),
                RESOURCE_FOLDER + FILE_NAME_TEMPLATE.TEMPLATE_2,
              ),
            ),
          );

          res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=report.docx`,
            'Access-Control-Expose-Headers': '*',
          });

          const file_2 = new StreamableFile(file);

          //console.log(file_2);

          return file_2;
        } else {
          //#region throw HandlerException
          throw new HandlerException(
            UNKNOW_EXIT_CODE.UNKNOW_ERROR,
            req.method,
            req.url,
            ErrorMessage.EXPORT_FILE_OPERATOR,
            HttpStatus.EXPECTATION_FAILED,
          );
          //#endregion
        }
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
   * @descripion Export thống kế phiếu của các khoa
   * @return File word
   * @page reports page
   */
  @Post('/admin/export/word')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async exportReportsByAdmin(
    @Body() params: GetReportsByDepartmentDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
        const result = await exportWordTemplateAdmin(
          academic,
          department,
          semester,
          academic_id,
          semester_id,
          cache_classes,
          levels,
          this._cacheClassService,
          this._departmentService,
          this._configurationService,
          this._sheetService,
          req,
        );

        const RESOURCE_FOLDER = this._configurationService.get(
          Configuration.RESOURCE_FOLDER,
        );

        if (result) {
          const file = fs.createReadStream(
            join(
              process.cwd(),
              RESOURCE_FOLDER + FILE_NAME_TEMPLATE.TEMPLATE_3,
            ),
          );

          res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=report.docx`,
            'Access-Control-Expose-Headers': '*',
          });

          const file_2 = new StreamableFile(file);

          //console.log(file_2);

          return file_2;
        } else {
          //#region throw HandlerException
          throw new HandlerException(
            UNKNOW_EXIT_CODE.UNKNOW_ERROR,
            req.method,
            req.url,
            ErrorMessage.EXPORT_FILE_OPERATOR,
            HttpStatus.EXPECTATION_FAILED,
          );
          //#endregion
        }
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
   * @descripion Export excel thống kế phiếu của lớp
   * @return File excel
   * @page reports page
   */
  @Post('/class/export/excel')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async exportExcelReportByClass(
    @Body() params: ExportReportsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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

      // //#region Validate role
      // const valid = await validateRole(
      //   department_id,
      //   role,
      //   user_id,
      //   this._userService,
      //   req,
      // );

      // if (valid instanceof HttpException) throw valid;
      // //#endregion
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
        const result = await exportExcelTemplateClass(
          params,
          academic,
          department,
          semester,
          cache_classes,
          levels,
          this._classService,
          this._sheetService,
          req,
        );

        if (result) {
          const file = fs.createReadStream(
            join(process.cwd(), PATH_FILE_EXCEL.OUTPUT_TEMPLATE_1A),
          );

          console.log(
            'file: ',
            fs.existsSync(
              join(process.cwd(), PATH_FILE_EXCEL.OUTPUT_TEMPLATE_1A),
            ),
          );
          res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=report.xlsx`,
            'Access-Control-Expose-Headers': '*',
          });

          return new StreamableFile(file);
        }
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
   * @descripion Export excel thống kế phiếu của khoa
   * @return File excel
   * @page reports page
   */
  @Post('/department/export/excel')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async exportExcelReportByDepartment(
    @Body() params: ExportReportsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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

      // //#region Validate role
      // const valid = await validateRole(
      //   department_id,
      //   role,
      //   user_id,
      //   this._userService,
      //   req,
      // );

      // if (valid instanceof HttpException) throw valid;
      // //#endregion
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
        const result = await exportExcelTemplateDepartment(
          params,
          academic,
          department,
          semester,
          cache_classes,
          levels,
          this._classService,
          this._sheetService,
          req,
        );
        if (result) {
          // const file = createReadStream(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_2A);
          const file = fs.createReadStream(
            join(process.cwd(), PATH_FILE_EXCEL.OUTPUT_TEMPLATE_2A),
          );

          const RESOURCE_FOLDER = this._configurationService.get(
            Configuration.RESOURCE_FOLDER,
          );

          console.log(
            'file: ',
            fs.existsSync(
              join(
                process.cwd(),
                RESOURCE_FOLDER + PATH_FILE_EXCEL.OUTPUT_TEMPLATE_2A,
              ),
            ),
          );

          res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=report.xlsx`,
            'Access-Control-Expose-Headers': '*',
          });

          const file_2 = new StreamableFile(file);

          //console.log(file_2);

          return file_2;
        }
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
   * @url api/reports/admin/export/excel
   * @param academic_id
   * @param semester_id
   * @param department_id?
   * @descripion Export excel thống kế phiếu của khoa
   * @return File excel
   * @page reports page
   */
  @Post('/admin/export/excel')
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async exportExcelReportByAdmin(
    @Body() params: ExportReportsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
        const result = await exportExcelTemplateAdmin(
          params,
          academic,
          department,
          semester,
          cache_classes,
          levels,
          this._departmentService,
          this._sheetService,
          this._cacheClassService,
          req,
        );
        if (result) {
          // const file = createReadStream(PATH_FILE_EXCEL.OUTPUT_TEMPLATE_2A);
          const file = fs.createReadStream(
            join(process.cwd(), PATH_FILE_EXCEL.OUTPUT_TEMPLATE_3A),
          );

          console.log(
            'file: ',
            fs.existsSync(
              join(process.cwd(), PATH_FILE_EXCEL.OUTPUT_TEMPLATE_3A),
            ),
          );

          res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=report.xlsx`,
            'Access-Control-Expose-Headers': '*',
          });

          const file_2 = new StreamableFile(file);

          //console.log(file_2);

          return file_2;
        }
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
