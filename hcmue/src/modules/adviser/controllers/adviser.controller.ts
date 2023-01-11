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

import { HandlerException } from '../../../exceptions/HandlerException';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

@Controller('advisers')
export class AdviserController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _adviserClassService: AdviserClassesService,
    private readonly _adviserService: AdviserService,
    private readonly _classService: ClassService,
    private readonly _configurationService: ConfigurationService,
    private readonly _departmentService: DepartmentService,
    private readonly _fileService: FilesService,
    private readonly _roleService: RoleService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

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
  @HttpCode(HttpStatus.OK)
  @Post('import')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params: params }),
      );

      const root = this._configurationService.get(Configuration.MULTER_DEST);

      const data = generateImportAdviser(
        params,
        root,
        this._academicYearService,
        this._adviserClassService,
        this._adviserService,
        this._classService,
        this._departmentService,
        this._fileService,
        this._roleService,
        this._roleUserService,
        this._dataSource,
        req,
      );
      if (data instanceof HttpException) throw data;
      else return data;
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
