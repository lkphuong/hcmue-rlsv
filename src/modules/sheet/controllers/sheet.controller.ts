import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';

import { Request } from 'express';

import {
  generateResponseSheetClass,
  generateResponseSheetUser,
} from '../utils';

import { GetSheetUserDto } from '../dtos/get_sheet_users.dto';
import { GetSheetByClass } from '../dtos/get_sheet_by_class.dto';

import { HttpPagingResponse } from 'src/interfaces/http-paging-response.interface';

import {
  SheetClassResponse,
  SheetUsersResponse,
} from '../interfaces/sheet_response.interface';

import { LogService } from '../../log/services/log.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { SheetService } from '../services/sheet.service';
import { UserService } from '../../user/services/user.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { Configuration } from '../../shared/constants/configuration.enum';

import { Levels } from '../../../constants/enums/level.enum';

import { ErrorMessage } from '../constants/errors.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('sheets')
export class SheetController {
  constructor(
    private readonly _sheetService: SheetService,
    private readonly _configurationService: ConfigurationService,
    private readonly _userService: UserService,
    private readonly _logger: LogService,
  ) {
    // Due to transient scope, SheetController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(SheetController.name);
  }

  /**
   * @method Post
   * @url /api/sheets/student/:user_id
   * @access private
   * @description Get danh sách phiếu đánh giá cá nhân
   * @return  HttpPagingResponse<SheetUsersResponse> | HttpException
   */
  @Post('student/:user_id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByUser(
    @Param('user_id') user_id: string,
    @Body() params: GetSheetUserDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<SheetUsersResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ user_id: user_id, params: params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ user_id: user_id, params: params }),
      );

      //#region Get params
      const { page } = params;
      let count = 0;
      let { pages } = params;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages === 0) {
        count = await this._sheetService.countSheetByUserId(user_id);
        pages = Math.ceil(count / itemsPerPage);
      }
      //#endregion

      //#region Get sheets
      const sheets = await this._sheetService.getSheetByUserIdPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        user_id,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        return generateResponseSheetUser(pages, page, sheets, req);
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.SHEETS_NO_CONTENT,
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
   * @method Post
   * @url /api/sheets/student/:user_id
   * @access private
   * @description Get danh sách phiếu đánh giá cá nhân
   * @return  HttpPagingResponse<SheetUsersResponse> | HttpException
   */
  @Post('class/:class_id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetByClas(
    @Param('class_id') class_id: string,
    @Body() params: GetSheetByClass,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<SheetClassResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ class_id: class_id, params: params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ class_id: class_id, params: params }),
      );

      //#region Get params
      const { page, inputs } = params;
      let count = 0;
      let { pages } = params;
      const { academic_id, semester_id } = inputs;
      let input = null;

      if (inputs) {
        input = inputs.input ?? null;
      }

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages === 0) {
        count = await this._sheetService.countSheet(semester_id, academic_id);
        pages = Math.ceil(count / itemsPerPage);
      }
      //#endregion

      //#region Get sheets
      const sheets = await this._sheetService.getSheetPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        semester_id,
        academic_id,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        return await generateResponseSheetClass(
          pages,
          page,
          input,
          sheets,
          this._userService,
          req,
        );
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMessage.SHEETS_NO_CONTENT,
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
