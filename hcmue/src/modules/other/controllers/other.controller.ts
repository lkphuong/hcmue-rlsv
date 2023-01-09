import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Request } from 'express';

import {
  createAccountDepartment,
  unlinkAccountDepartment,
  updateAccountDepartment,
} from '../funcs';

import { validateAccountById, validateOtherId } from '../validations';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { DepartmentService } from '../../department/services/department.service';
import { LogService } from '../../log/services/log.service';
import { OtherService } from '../services/other.service';
import { RoleService } from '../../role/services/role/role.service';
import { RoleUsersService } from '../../role/services/role_users/role_users.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { CreateAccountDto } from '../dtos/create_account.dto';
import { UpdateAccountDto } from '../dtos/update_account.dto';
import { GetAccountDepartment } from '../dtos/get_account.dto';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';
import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  AccountDepartmentResponse,
  OtherResponse,
} from '../interfaces/other_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { Configuration } from '../../shared/constants/configuration.enum';
import { ErrorMessage } from '../constants/enums/error.enum';
import {
  generateDepartmentResponse,
  generateDepartmentsResponse,
} from '../utils';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/constants/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { sprintf } from '../../../utils';
import { UnknownException } from '../../../exceptions/UnknownException';

@Controller('others')
export class OtherController {
  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _departmentService: DepartmentService,
    private readonly _otherService: OtherService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _roleService: RoleService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  /**
   * @method GET
   * @url api/others/:id
   * @access private
   * @description Xem chi tiết tài khoản khoa
   * @returns
   * @page other page
   */
  @Get(':department_id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getAccountById(
    @Param('department_id') department_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<AccountDepartmentResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ department_id: department_id }),
      );

      //#region Get Other
      const department = await this._departmentService.getDepartmentById(
        department_id,
      );
      if (department) {
        return await generateDepartmentResponse(
          department,
          this._otherService,
          req,
        );
      } else {
        //#region throw HandlerException
        throw new UnknownException(
          department_id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.DEPARTMENT_NOT_FOUND_ERROR, department_id),
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

  /**
   * @method POST
   * @url api/others/all
   * @access private
   * @description Danh sachs tài khoản khoa
   * @return HttpPagingResponse<AccountDepartmentResponse> | HttpException
   * @page other page
   */
  @Post('all')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getAccountDepartment(
    @Body() params: GetAccountDepartment,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<AccountDepartmentResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Get params
      const { department_id, page, input } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      if (pages === 0) {
        //#region Get pages
        const count = await this._departmentService.count(department_id, input);
        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }

      //#region get department
      const departments = await this._departmentService.getDepartmentPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        department_id,
        input,
      );
      //#endregion

      if (departments && departments.length > 0) {
        return await generateDepartmentsResponse(
          pages,
          page,
          departments,
          this._otherService,
          req,
        );
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.DEPARTMENT_NO_CONTENT,
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
   * @url api/others
   * @access private
   * @description Tạo mới tài khoản khoa
   * @return HttpResponse<OtherResponse> | HttpException
   * @page others page
   */
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAccountDepartment(
    @Body() params: CreateAccountDto,
    @Req() req: Request,
  ): Promise<HttpResponse<OtherResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      const other = await createAccountDepartment(
        params,
        this._departmentService,
        this._otherService,
        this._roleUserService,
        this._roleService,
        this._dataSource,
        req,
      );

      if (other instanceof HttpException) throw other;
      return other;
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
   * @method PUT
   * @url api/others/:id
   * @access private
   * @description Cập nhật tên đăng nhập
   * @return HttpResponse<OtherResponse> | HttpException
   * @page others page
   */
  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateAccountDepartment(
    @Param('id') id: number,
    @Body() params: UpdateAccountDto,
    @Req() req: Request,
  ): Promise<HttpResponse<OtherResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      const other = await updateAccountDepartment(
        id,
        params,
        this._otherService,
        req,
      );

      if (other instanceof HttpException) throw other;
      return other;
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
   * @url api/others/:id
   * @access private
   * @description Xóa tài khoản khoa
   * @return HttpResponse<OtherResponse> | HttpException
   * @page others page
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async deleteAccountDepartment(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<OtherResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Validate id
      const valid = validateOtherId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate account
      const other = await validateAccountById(id, this._otherService, req);
      if (other instanceof HttpException) throw other;
      //#endregion

      //#region Unlink account department
      const result = await unlinkAccountDepartment(
        id,
        this._otherService,
        this._roleUserService,
        this._dataSource,
        req,
      );
      if (result instanceof HttpException) throw result;
      else return result;
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
