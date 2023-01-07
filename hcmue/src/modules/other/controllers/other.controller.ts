import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { generateFailedResponse, generateSuccessResponse } from '../utils';

import { createAccountDepartment, updateAccountDepartment } from '../funcs';

import { validateAccountById } from '../validations';

import { DepartmentService } from '../../department/services/department.service';
import { LogService } from '../../log/services/log.service';
import { OtherService } from '../services/other.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { CreateAccountDto } from '../dtos/create_account.dto';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { OtherResponse } from '../interfaces/other_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { UpdateAccountDto } from '../dtos/update_account.dto';
import { ErrorMessage } from '../constants/enums/error.enum';

@Controller('others')
export class OtherController {
  constructor(
    private readonly _departmentService: DepartmentService,
    private readonly _otherService: OtherService,
    private _logger: LogService,
  ) {}

  /**
   * @method POST
   * @url api/others
   * @access private
   * @description Tạo mới tài khoản khoa
   * @return HttpResponse<OtherResponse> | HttpException
   * @page others page
   */
  @Post()
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
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async deleteAccountDepartment(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<OtherResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Validate account
      const other = await validateAccountById(id, this._otherService, req);
      if (other instanceof HttpException) throw other;
      //#endregion

      //#region Unlink account department
      const result = await this._otherService.unlink(id);
      if (result) {
        //#region Generate response
        return await generateSuccessResponse(other, req);
        //#endregion
      } else {
        //#region throw HandlerException
        return generateFailedResponse(req, ErrorMessage.OPERATOR_OTHER_ERROR);
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
}
