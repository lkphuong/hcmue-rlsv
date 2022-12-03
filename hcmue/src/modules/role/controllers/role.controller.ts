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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { sprintf } from '../../../utils';

import {
  generateFailedResponse,
  generateResponses,
  generateUserIds,
} from '../utils';

import { RoleUsersEntity } from '../../../entities/role_users.entity';

import { GetUsersDto } from '../dtos/get_users.dto';
import { RoleDto } from '../dtos/role.dto';

import { generateRoleUser } from '../transform';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { RoleService } from '../services/role/role.service';
import { RoleUsersService } from '../services/role_users/role_users.service';
import { UserService } from '../../user/services/user.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';

import {
  RoleUserResponse,
  UserResponse,
} from '../interfaces/user_response.interface';
import { HttpResponse } from '../../../interfaces/http-response.interface';
import { JwtPayload } from 'src/modules/auth/interfaces/payloads/jwt-payload.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Configuration } from '../../shared/constants/configuration.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { validateUserId } from '../validations';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly _roleService: RoleService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _userService: UserService,
    private readonly _configurationService: ConfigurationService,
    private _logger: LogService,
  ) {}

  /**
   * @method POST
   * @url /api/roles/users
   * @access private
   * @description Hiện thị danh sách sinh viên
   * @return
   * @page roles page
   */
  @HttpCode(HttpStatus.OK)
  @Post('users')
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
      const { page, classes, department, input } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages === 0) {
        //#region
        const count = await this._userService.count(classes, department, input);

        console.log('count: ', count);

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }
      //#endregion

      //#region Get users
      const users = await this._userService.getUsersPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        classes,
        department,
        input,
      );
      //#endregion

      if (users && users.length > 0) {
        //#region Generate user_ids
        const user_ids = generateUserIds(users);
        //#endregion

        const role_users = await this._roleUserService.getRoleUsers(user_ids);

        //#region Generate response
        return await generateResponses(pages, page, users, role_users, req);
        //#endregion
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.USERS_NO_CONTENT,
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
   * @method PUT
   * @url /api/roles/users/:user_id
   * @access private
   * @description Cập nhật role cho user
   * @return
   * @page roles page
   */
  @Put('users/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateRole(
    @Param('id') id: string,
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
          JSON.stringify({ user_id: id, ...params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ user_id: id, ...params }),
      );

      //#region Validate id
      const valid = validateUserId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get data jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { classes, department, role_id } = params;
      //#endregion

      //#region Get Role by code
      const role = await this._roleService.getRoleByCode(role_id);
      //#endregion

      if (role) {
        if (role_id != RoleCode.ADMIN) {
          //#region update old role user
          await this._roleUserService.buklUnlink(
            role_id,
            role.id,
            department,
            classes,
          );
          //#endregion
        }

        //#region Get role user
        const role_user = await this._roleUserService.getRoleUserByUserId(id);
        if (role_user) {
          //#region delete role user
          await this._roleUserService.unlink(role_user.id);
          //#endregion
        }
        //#endregion

        //#region create new role user
        let new_role_user = new RoleUsersEntity();
        new_role_user.user_id = id;
        new_role_user.department_id = department;
        new_role_user.class_id = classes;
        new_role_user.role = role;
        new_role_user.created_at = new Date();
        new_role_user.created_by = user_id;
        new_role_user = await this._roleUserService.add(new_role_user);
        //#endregion

        if (new_role_user) {
          return {
            data: generateRoleUser(role),
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
        //#region throw HandleException
        throw new UnknownException(
          user_id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.ROLE_NOT_FOUND_ERROR, user_id),
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
}
