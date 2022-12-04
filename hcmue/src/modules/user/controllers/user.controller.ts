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

import { generateResponses, generateUserIds } from '../utils';

import { GetUsersDto } from '../dtos/get_users.dto';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { RoleUsersService } from '../../role/services/role_users/role_users.service';
import { UserService } from '../services/user.service';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';
import { UserResponse } from '../interfaces/get-users-response.interface';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _roleUserService: RoleUsersService,
    private readonly _userService: UserService,
    private _logger: LogService,
  ) {}

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
  @Post('users')
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
      const { page, class_id, department_id, input } = params;
      let { pages } = params;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages === 0) {
        const count = await this._userService.count(
          class_id,
          department_id,
          input,
        );

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
      }
      //#endregion

      //#region Get users
      const users = await this._userService.getUsersPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        class_id,
        department_id,
        input,
      );
      //#endregion

      if (users && users.length > 0) {
        //#region Generate user_ids
        const user_ids = generateUserIds(users);
        const role_users = await this._roleUserService.getRoleUsers(user_ids);
        //#endregion

        //#region Generate response
        return await generateResponses(pages, page, users, role_users, req);
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
}
