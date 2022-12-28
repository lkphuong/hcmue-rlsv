import {
  Body,
  CACHE_MANAGER,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { generateResponses } from '../utils';
import { generateImportUsers } from '../funcs';

import { GetUsersDto } from '../dtos/get_users.dto';
import { ImportUsersDto } from '../dtos/import_users.dto';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { FilesService } from '../../file/services/files.service';
import { KService } from '../../k/services/k.service';
import { MajorService } from '../../major/services/major.service';
import { RoleUsersService } from '../../role/services/role_users/role_users.service';
import { SemesterService } from '../../semester/services/semester.service';
import { StatusService } from '../../status/status/status.service';
import { UserService } from '../services/user.service';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';
import { UserResponse } from '../interfaces/users-response.interface';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { CACHE_KEY } from '../constants/enums/cache_key.enum';

@Controller('users')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
    private readonly _academicYearService: AcademicYearService,
    private readonly _configurationService: ConfigurationService,
    private readonly _classService: ClassService,
    private readonly _departmentService: DepartmentService,
    private readonly _fileService: FilesService,
    private readonly _kService: KService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _semesterService: SemesterService,
    private readonly _userService: UserService,
    private readonly _statusService: StatusService,
    private readonly _majorService: MajorService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async onModuleInit() {
    //#region get classes and cache
    const $class = await this._classService.getClasses();
    await this._cacheManager.set(CACHE_KEY.CLASS, $class, 0);
    //#endregion

    //#region get status and cache
    const statuses = await this._statusService.getStatuses();
    await this._cacheManager.set(CACHE_KEY.STATUS, statuses, 0);
    //#endregion

    //#region get department and cache
    const departments = await this._departmentService.getDepartments();
    await this._cacheManager.set(CACHE_KEY.DEPARTMENT, departments, 0);
    //#endregion

    //#region get k and cache
    const k = await this._kService.getAll();
    await this._cacheManager.set(CACHE_KEY.K, k, 0);
    //#endregion

    //#region  get major and cache
    const majors = await this._majorService.getMajors();
    await this._cacheManager.set(CACHE_KEY.MAJOR, majors, 0);
    //#endregion
  }
  /**
   * @method POST
   * @url /api/users
   * @access private
   * @param pages
   * @param page
   * @param department_id
   * @param class_id
   * @param input?
   * @description Hiện thị danh sách sinh viên
   * @return HttpPagingResponse<UserResponse> | HttpException
   * @page roles page
   */
  @HttpCode(HttpStatus.OK)
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getUsers(
    @Body() params: GetUsersDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<UserResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + '');

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get parrams
      const { academic_id, class_id, department_id, input, page, semester_id } =
        params;
      let { pages } = params;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages === 0) {
        const count = await this._userService.count(
          academic_id,
          semester_id,
          class_id,
          department_id,
          input,
        );

        console.log('count: ', count);

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
      }
      //#endregion

      //#region Get users
      const users = await this._userService.getUsersPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        academic_id,
        semester_id,
        class_id,
        department_id,
        input,
      );
      //#endregion

      if (users && users.length > 0) {
        //#region Generate response
        return await generateResponses(pages, page, users, req);
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
   * @url /api/users/import
   * @param academic_id
   * @param semester
   * @param file_id
   * @description Import danh danh sách sinh viên
   * @return status ? true : false
   * @page users
   */
  @HttpCode(HttpStatus.OK)
  @Post('import')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async importUsers(@Body() params: ImportUsersDto, @Req() req: Request) {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ' - ' +
          JSON.stringify({ params: params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params: params }),
      );

      const root = this._configurationService.get(Configuration.MULTER_DEST);

      const data = generateImportUsers(
        params,
        root,
        this._academicYearService,
        this._fileService,
        this._semesterService,
        this._cacheManager,
        this._dataSource,
        req,
      );
      if (data instanceof HttpException) throw data;
      return data;
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
