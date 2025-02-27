import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  HttpException,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { generateResponses } from '../utils';

import { generateImportAdviser } from '../funcs';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { AdviserClassesService } from '../services/adviser-classes/adviser_classes.service';
import { AdviserService } from '../services/adviser/adviser.service';
import { ClassService } from '../../class/services/class.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { DepartmentService } from '../../department/services/department.service';
import { FilesService } from '../../file/services/files.service';
import { LogService } from '../../log/services/log.service';
import { RoleService } from '../../role/services/role/role.service';
import { RoleUsersService } from '../../role/services/role_users/role_users.service';

import { ImportAdviserDto } from '../dtos/import.dto';
import { GetAdviserDto } from '../dtos/get_adviser.dto';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';
import { GetAdviserResponse } from '../interfaces/adviser-response.interface';

import { HandlerException } from '../../../exceptions/HandlerException';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { SemesterService } from '../../semester/services/semester.service';

@Controller('advisers')
export class AdviserController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _adviserClassService: AdviserClassesService,
    private readonly _adviserService: AdviserService,
    private readonly _semesterService: SemesterService,
    private readonly _classService: ClassService,
    private readonly _configurationService: ConfigurationService,
    private readonly _departmentService: DepartmentService,
    private readonly _fileService: FilesService,
    private readonly _roleService: RoleService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _dataSource: DataSource,
    private readonly _eventEmitter: EventEmitter2,
    private _logger: LogService,
  ) {}

  /**
   * @method POST
   * @url api/advisers/all
   * @access private
   * @param pages
   * @param page
   * @param academic_id
   * @param department_id
   * @param class_id
   * @description Hiện thị danh sách cố vấn học tập
   * @return HttpPagingResponse<UserResponse> | HttpException
   * @page adviser page
   */
  @HttpCode(HttpStatus.OK)
  @Post('all')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getAdvisers(
    @Body() params: GetAdviserDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<GetAdviserResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + '');

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get params
      const { academic_id, class_id, department_id, input, page, semester_id } =
        params;
      let { pages } = params;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages === 0) {
        const count = await this._adviserService.count(
          academic_id,
          class_id,
          department_id,
          input,
          semester_id,
        );
        if (count > 0) pages = Math.ceil(count / itemsPerPage);
      }
      //#endregion

      //#region Get adviser
      const advisers = await this._adviserService.getAdviserPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        academic_id,
        class_id,
        department_id,
        input,
        semester_id,
      );
      //#endregion

      if (advisers && advisers.length > 0) {
        //#region Generate Response
        return await generateResponses(pages, page, advisers, req);
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

  /**
   * @method POST
   * @url /api/advisers
   * @access private
   * @param academic_id
   * @param file_id
   * @description Import danh sách cố vấn học tập
   * @return status ? true : false
   * @page advisers
   */

  @Post('import')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async importAdvisers(@Body() params: ImportAdviserDto, @Req() req: Request) {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ' - ' +
          JSON.stringify({ params: params }),
      );

      console.log('param: ', params);

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params: params }),
      );

      const root = this._configurationService.get(Configuration.MULTER_DEST);

      const data = await generateImportAdviser(
        params,
        root,
        this._academicYearService,
        this._adviserClassService,
        this._adviserService,
        this._semesterService,
        this._classService,
        this._departmentService,
        this._fileService,
        this._roleService,
        this._roleUserService,
        this._dataSource,
        this._eventEmitter,
        req,
      );
      if (data instanceof HttpException) throw data;
      else return data;
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
