import {
  Body,
  Controller,
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

import { createRoleUser } from '../funcs';

import {
  validateClass,
  validateDepartment,
  validateRole,
  validateUser,
  validateAllowedChangeRole,
} from '../validations';

import { RoleDto } from '../dtos/role.dto';

import { LogService } from '../../log/services/log.service';

import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { RoleService } from '../services/role/role.service';
import { RoleUsersService } from '../services/role_users/role_users.service';
import { UserService } from '../../user/services/user.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { HttpResponse } from '../../../interfaces/http-response.interface';

import {
  CheckRoleUserResponse,
  RoleUserResponse,
} from '../interfaces/assign-user-role-response.interface';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { Roles } from '../../auth/decorators/roles.decorator';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { GetUserDto } from '../dtos/get_user.dto';
import { ErrorMessage } from '../constants/enums/errors.enum';
import {
  generateCheckRoleUserSuccessResponse,
  generateFailedResponse,
} from '../utils';
import { RoleCode } from '../../../constants/enums/role_enum';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly _classService: ClassService,
    private readonly _departmentService: DepartmentService,
    private readonly _roleService: RoleService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _userService: UserService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  /**
   * @method PUT
   * @url /api/roles/:user_id
   * @access private
   * @param user_id
   * @param department_id
   * @param class_id
   * @param role_id
   * @description Cập nhật role cho user
   * @return HttpResponse<RoleUserResponse> | HttpException
   * @page roles page
   */
  @Put(':std_code')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.ADVISER)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateRole(
    @Param('std_code') std_code: string,
    @Body() params: RoleDto,
    @Req() req: Request,
  ): Promise<HttpResponse<RoleUserResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ std_code, ...params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ std_code, ...params }),
      );

      //#region Get params
      const { class_id, department_id, role_id } = params;
      //#endregion

      //#region Validation
      //#region Validate class
      const $class = await validateClass(class_id, this._classService, req);

      if ($class instanceof HttpException) throw $class;
      //#endregion

      //#region Validate department
      const department = await validateDepartment(
        department_id,
        this._departmentService,
        req,
      );

      if (department instanceof HttpException) throw department;
      //#endregion

      if (role_id === RoleCode.STUDENT) {
        const result = await this._roleUserService.unlink(std_code);
        if (result) {
          const payload: RoleUserResponse = {
            id: 0,
            name: 'Sinh viên',
          };
          return {
            data: payload,
            errorCode: 0,
            message: null,
            errors: null,
          };
        } else {
          throw generateFailedResponse(
            req,
            ErrorMessage.OPERATOR_ROLE_USER_ERROR,
          );
        }
      } else {
        //#region Validate role
        const role = await validateRole(role_id, this._roleService, req);
        if (role instanceof HttpException) throw role;
        //#endregion

        //#region Validate user
        const user = await validateUser(std_code, this._userService, req);
        if (user instanceof HttpException) throw user;
        //#endregion

        //#region valid role adviser, department, admin
        const valid = validateAllowedChangeRole(role, req);
        if (valid instanceof HttpException) throw valid;
        //#endregion
        //#endregion

        //#region Get data jwt payload
        const { username: request_code } = req.user as JwtPayload;
        //#endregion

        //#region Create role_user
        const result = await createRoleUser(
          request_code,
          class_id,
          department_id,
          user.std_code,
          role,
          this._roleUserService,
          this._dataSource,
          req,
        );
        //#endregion

        //#region Generate response
        if (result instanceof HttpException) throw result;
        return result;
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
   * @url /api/roles/check
   * @access private
   * @param department_id
   * @param class_id
   * @param role_id
   * @description Kiểm tra lớp hoặc khoa đã tồn tại role
   * @return
   * @page roles page
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.ADVISER)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async checkRole(
    @Body() params: GetUserDto,
    @Req() req: Request,
  ): Promise<HttpResponse<CheckRoleUserResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ params: params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params: params }),
      );

      //#region Get params
      const { class_id, department_id, role_id, academic_id, semester_id } =
        params;
      //#endregion

      const role_user = await this._roleUserService.checkRoleUser(
        department_id,
        role_id,
        class_id,
      );

      if (role_user) {
        const user = await this._userService.getUserByCode(
          role_user.std_code,
          academic_id,
          semester_id,
        );
        if (user) {
          return generateCheckRoleUserSuccessResponse(
            role_user,
            user,
            null,
            req,
          );
        }
      }
      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
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
}
