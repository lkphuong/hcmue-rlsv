import {
  Controller,
  Post,
  Body,
  Req,
  ValidationPipe,
  UsePipes,
  HttpException,
  Put,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { HandlerException } from 'src/exceptions/HandlerException';

import { HttpResponse } from 'src/interfaces/http-response.interface';
import { JwtPayload } from 'src/modules/auth/interfaces/payloads/jwt-payload.interface';

import { AcademicYearService } from 'src/modules/academic-year/services/academic_year.service';
import { HeaderService } from 'src/modules/header/services/header.service';
import { ItemService } from 'src/modules/item/services/item.service';
import { LogService } from 'src/modules/log/services/log.service';
import { OptionService } from 'src/modules/option/services/option.service';
import { SemesterService } from 'src/modules/semester/services/semester.service';
import { TitleService } from 'src/modules/title/services/title.service';

import { CreateFormDto } from '../dtos/add_form.dto';
import { CreateItemDto } from '../dtos/add_item.dto';
import { CreateTitleDto } from '../dtos/add_title.dto';
import {
  createForm,
  createItem,
  createTile,
  updateForm,
  updateItem,
  updateTitle,
} from '../funcs';
import {
  BaseResponse,
  CreateFormResponse,
  ItemResponse,
} from '../interfaces/form_response.interface';
import { FormmService } from '../service/service.service';
import { validateFormId } from '../validations';

import { SERVER_EXIT_CODE } from 'src/constants/enums/error-code.enum';
import { Levels } from 'src/constants/enums/level.enum';

@Controller('forms')
export class FormController {
  constructor(
    private readonly _formService: FormmService,
    private readonly _academicYearService: AcademicYearService,
    private readonly _semesterService: SemesterService,
    private readonly _headerService: HeaderService,
    private readonly _titleService: TitleService,
    private readonly _itemServicve: ItemService,
    private readonly _optionService: OptionService,
    private readonly _dataSource: DataSource,
    private readonly _logger: LogService,
  ) {
    // Due to transient scope, SheetController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(FormController.name);
  }

  /**
   * @method POST
   * @url /api/forms/
   * @access private
   * @description Tạo mới biểu mẫu
   * @return HttpResponse<CreateFormResponse> | HttpException
   * @page forms
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createForm(
    @Body() params: CreateFormDto,
    @Req() req: Request,
  ): Promise<HttpResponse<CreateFormResponse> | HttpException> {
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

      const { user_id } = req.user as JwtPayload;

      return await createForm(
        user_id,
        params,
        this._academicYearService,
        this._semesterService,
        this._dataSource,
        req,
      );
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
   * @url /api/forms/titles
   * @access private
   * @description Tạo mới tiêu chí đánh giá
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms
   */
  @Post('titles')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createTitle(
    @Body() params: CreateTitleDto,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
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

      const { user_id } = req.user as JwtPayload;

      const result = await createTile(
        user_id,
        params,
        this._headerService,
        this._titleService,
        this._dataSource,
        req,
      );

      if (result instanceof HttpException) throw result;

      return result;
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
   * @url /api/forms/titles
   * @access private
   * @description Tạo mới tiêu chí đánh giá
   * @return HttpResponse<ItemResponse> | HttpException
   * @page forms
   */
  @Post('items')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createItem(
    @Body() params: CreateItemDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemResponse> | HttpException> {
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

      const { user_id } = req.user as JwtPayload;

      const result = await createItem(
        user_id,
        params,
        this._titleService,
        this._dataSource,
        req,
      );

      if (result instanceof HttpException) throw result;

      return result;
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
   * @url /api/forms/:id
   * @access private
   * @description Cập nhật thông tin biểu mẫu
   * @return HttpResponse<CreateFormResponse> | HttpException
   * @page forms
   */
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateForm(
    @Param('id') id: number,
    @Body() params: CreateFormDto,
    @Req() req: Request,
  ): Promise<HttpResponse<CreateFormResponse> | HttpException> {
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

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const { user_id } = req.user as JwtPayload;

      return await updateForm(
        id,
        user_id,
        params,
        this._formService,
        this._academicYearService,
        this._semesterService,
        this._dataSource,
        req,
      );
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
   * @url /api/forms/titles/:id
   * @access private
   * @description Cập nhật tiêu chí đánh giá
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms
   */
  @Put('titles/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateTitle(
    @Param('id') id: number,
    @Body() params: CreateTitleDto,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
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

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const { user_id } = req.user as JwtPayload;

      const result = await updateTitle(
        id,
        user_id,
        params,
        this._headerService,
        this._titleService,
        this._dataSource,
        req,
      );

      if (result instanceof HttpException) throw result;
      return result;
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
   * @url /api/forms/titles/:id
   * @access private
   * @description Cập nhật nội dung đánh giá
   * @return HttpResponse<ItemResponse> | HttpException
   * @page forms
   */
  @Put('items/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateItem(
    @Param('id') id: number,
    @Body() params: CreateItemDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemResponse> | HttpException> {
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

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const { user_id } = req.user as JwtPayload;

      const result = await updateItem(
        user_id,
        id,
        params,
        this._titleService,
        this._itemServicve,
        this._optionService,
        this._dataSource,
        req,
      );

      if (result instanceof HttpException) throw result;
      return result;
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
