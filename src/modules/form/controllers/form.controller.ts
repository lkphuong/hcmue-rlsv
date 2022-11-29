import {
  Body,
  Controller,
  Get,
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
import { DataSource } from 'typeorm';

import { sprintf } from '../../../utils';

import {
  generateFormResponse,
  generateFormsResponse,
  generateHeadersResponse,
  generateItemsResponse,
  generateTitlesResponse,
} from '../utils';

import {
  createForm,
  createHeader,
  createItem,
  createTitle,
  setFormStatus,
  updateForm,
  updateHeader,
  updateItem,
  updateTitle,
} from '../funcs';

import {
  validateFormId,
  validateFormPubishStatus,
  validateFormUnPubishStatus,
  validateHeaderId,
  validateTitleId,
} from '../validations';

import { HeaderDto } from '../dtos/header.dto';
import { FormDto } from '../dtos/form.dto';
import { TitleDto } from '../dtos/title.dto';
import { ItemDto } from '../dtos/item.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { FormService } from '../services/form.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { LogService } from '../../log/services/log.service';
import { OptionService } from '../../option/services/option.service';
import { SemesterService } from '../../semester/services/semester.service';
import { TitleService } from '../../title/services/title.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  BaseResponse,
  FormResponse,
  HeaderResponse,
  ItemResponse,
} from '../interfaces/form_response.interface';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { Levels } from '../../../constants/enums/level.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { FormStatus } from '../constants/enums/statuses.enum';

@Controller('forms')
export class FormController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _formService: FormService,
    private readonly _headerService: HeaderService,
    private readonly _itemServicve: ItemService,
    private readonly _optionService: OptionService,
    private readonly _semesterService: SemesterService,
    private readonly _titleService: TitleService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {
    // Due to transient scope, FormController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(FormController.name);
  }

  /**
   * @method GET
   * @url /api/forms
   * @access private
   * @description Hiển thị danh sách biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Get('/')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getForms(
    @Req() req: Request,
  ): Promise<HttpResponse<FormResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + '');

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get forms
      const forms = await this._formService.getForms();
      //#endregion

      if (forms && forms.length > 0) {
        //#region Generate response
        return await generateFormsResponse(forms, req);
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
   * @method GET
   * @url /api/forms/:id
   * @access private
   * @param id
   * @description Hiển thị chi tiết biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getFormById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<FormResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ id: id }),
      );

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get form
      const form = await this._formService.getFormById(id);
      if (form) {
        //#region Generate response
        return await generateFormResponse(form, null, req);
        //#endregion
      } else {
        //#region throw HandlerException
        return new UnknownException(
          id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, id),
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
   * @method PUT
   * @url /api/forms/publish/:id
   * @access private
   * @param id
   * @description Phát hành biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Put('publish/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async setPublishForm(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<FormResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ id: id }),
      );

      //#region Validation
      let valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get form
      const form = await this._formService.getFormById(id);
      if (form) {
        //#region Validate form status
        valid = validateFormPubishStatus(form, req);
        if (valid instanceof HttpException) throw valid;
        //#endregion

        //#region Get jwt payload
        const { user_id } = req.user as JwtPayload;
        //#endregion

        //#region Set form status
        return await setFormStatus(
          user_id,
          FormStatus.PUBLISHED,
          form,
          this._formService,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        return new UnknownException(
          id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, id),
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
   * @method PUT
   * @url /api/forms/un-publish/:id
   * @access private
   * @param id
   * @description Hủy phát hành biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Put('un-publish/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async cancelPublishForm(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<FormResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ id: id }),
      );

      //#region Validation
      let valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get form
      const form = await this._formService.getFormById(id);
      if (form) {
        //#region Validate form status
        valid = validateFormUnPubishStatus(form, req);
        if (valid instanceof HttpException) throw valid;
        //#endregion

        //#region Get jwt payload
        const { user_id } = req.user as JwtPayload;
        //#endregion

        //#region Set form status
        return await setFormStatus(
          user_id,
          FormStatus.DRAFTED,
          form,
          this._formService,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        return new UnknownException(
          id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          sprintf(ErrorMessage.FORM_NOT_FOUND_ERROR, id),
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
   * @method GET
   * @url /api/forms/headers/:form_id
   * @access private
   * @param form_id
   * @description Hiển thị danh sách hạng mục đánh giá theo biểu mẫu
   * @return HttpResponse<HeaderResponse> | HttpException | null
   * @page forms page
   */
  @Get('headers/:form_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getHeadersByFormId(
    @Param('form_id') form_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<HeaderResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ form_id: form_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: form_id }),
      );

      //#region Validation
      const valid = validateFormId(form_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get headers
      const headers = await this._headerService.getHeadersByFormId(form_id);
      //#endregion

      if (headers && headers.length > 0) {
        //#region Generate response
        return await generateHeadersResponse(headers, req);
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
   * @method GET
   * @url /api/forms/titles/:header_id
   * @access private
   * @param header_id
   * @description Hiển thị danh sách tiêu chí đánh giá theo hạng mục
   * @return HttpResponse<BaseResponse> | HttpException | null
   * @page forms page
   */
  @Get('titles/:header_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getTitlesByHeaderId(
    @Param('header_id') header_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ header_id: header_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ header_id: header_id }),
      );

      //#region Validation
      const valid = validateHeaderId(header_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get titles
      const titles = await this._titleService.getTitlesByHeaderId(header_id);
      //#endregion

      if (titles && titles.length > 0) {
        //#region Generate response
        return await generateTitlesResponse(titles, req);
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
   * @method GET
   * @url /api/forms/items/:title_id
   * @access private
   * @param title_id
   * @description Hiển thị danh sách nội dung chấm điểm theo tiêu chí đánh giá
   * @return HttpResponse<ItemResponse> | HttpException | null
   * @page forms page
   */
  @Get('items/:title_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getItemsByTitleId(
    @Param('title_id') title_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ title_id: title_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ title_id: title_id }),
      );

      //#region Validation
      const valid = validateTitleId(title_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get items
      const items = await this._itemServicve.getItemsByTitleId(title_id);
      //#endregion

      if (items && items.length > 0) {
        //#region Generate items response
        return await generateItemsResponse(items, req);
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
   * @url /api/forms/
   * @access private
   * @param academic_id
   * @param semester_id
   * @param student
   * @param class
   * @param department
   * @description Tạo mới biểu mẫu
   * @return HttpResponse<CreateFormResponse> | HttpException
   * @page forms page
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createForm(
    @Body() params: FormDto,
    @Req() req: Request,
  ): Promise<HttpResponse<FormResponse> | HttpException> {
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

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Create form
      const form = await createForm(
        user_id,
        params,
        this._academicYearService,
        this._formService,
        this._semesterService,
        req,
      );
      //#endregion

      //#region Generate response
      if (form instanceof HttpException) throw form;
      else return form;
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
   * @url /api/forms/headers
   * @access private
   * @param form_id
   * @param name
   * @param max_mark
   * @description Thêm hạng mục đánh giá cho biểu mẫu
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms page
   */
  @Post('headers')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async createHeader(
    @Body() params: HeaderDto,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Create header
      const header = await createHeader(
        user_id,
        params,
        this._formService,
        this._headerService,
        req,
      );
      //#endregion

      //#region Generate response
      if (header instanceof HttpException) throw header;
      else return header;
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
   * @url /api/forms/titles
   * @access private
   * @param form_id
   * @param header_id
   * @param name
   * @description Tạo mới tiêu chí đánh giá
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms page
   */
  @Post('titles')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createTitle(
    @Body() params: TitleDto,
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

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Create title
      const result = await createTitle(
        user_id,
        params,
        this._formService,
        this._headerService,
        this._titleService,
        req,
      );
      //#endregion

      //#region Generate response
      if (result instanceof HttpException) throw result;
      return result;
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
   * @url /api/forms/titles
   * @access private
   * @param form_id
   * @param title_id
   * @param control
   * @param content
   * @param from_mark
   * @param to_mark
   * @param category
   * @param unit
   * @param required
   * @param options
   * @description Tạo mới nội dung chấm điểm
   * @return HttpResponse<ItemResponse> | HttpException
   * @page forms page
   */
  @Post('items')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createItem(
    @Body() params: ItemDto,
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

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Create item
      const result = await createItem(
        user_id,
        params,
        this._formService,
        this._itemServicve,
        this._optionService,
        this._titleService,
        this._dataSource,
        req,
      );
      //#endregion

      //#region Generate response
      if (result instanceof HttpException) throw result;
      return result;
      //#endregion
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
   * @param id
   * @param academic_id
   * @param semester_id
   * @param student
   * @param class
   * @param department
   * @description Cập nhật thông tin biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException
   * @page forms
   */
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateForm(
    @Param('id') id: number,
    @Body() params: FormDto,
    @Req() req: Request,
  ): Promise<HttpResponse<FormResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ form_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ form_id: id, params }),
      );

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Update form
      const form = await updateForm(
        id,
        user_id,
        params,
        this._academicYearService,
        this._formService,
        this._semesterService,
        req,
      );
      //#endregion

      //#region Generate response
      if (form instanceof HttpException) throw form;
      else return form;
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
   * @method PUT
   * @url /api/forms/headers/:id
   * @access private
   * @param id
   * @param form_id
   * @param name
   * @param max_mark
   * @description Cập nhật hạng mục đánh giá (Header) cho biểu mẫu
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms
   */
  @Put('headers/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async updateHeader(
    @Param('id') id: number,
    @Body() params: HeaderDto,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ header_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ header_id: id, params }),
      );

      //#region Validation
      const valid = validateHeaderId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Update header
      const header = await updateHeader(
        id,
        user_id,
        params,
        this._formService,
        this._headerService,
        req,
      );
      //#endregion

      //#region Generate response
      if (header instanceof HttpException) throw header;
      else return header;
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
   * @method PUT
   * @url /api/forms/titles/:id
   * @access private
   * @param id
   * @param form_id
   * @param header_id
   * @param name
   * @description Cập nhật tiêu chí đánh giá
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms
   */
  @Put('titles/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateTitle(
    @Param('id') id: number,
    @Body() params: TitleDto,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ title_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ title_id: id, params }),
      );

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Update title
      const result = await updateTitle(
        id,
        user_id,
        params,
        this._formService,
        this._headerService,
        this._titleService,
        req,
      );
      //#endregion

      //#region Generate response
      if (result instanceof HttpException) throw result;
      return result;
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
   * @method PUT
   * @url /api/forms/titles/:id
   * @access private
   * @param id
   * @param form_id
   * @param title_id
   * @param control
   * @param content
   * @param from_mark
   * @param to_mark
   * @param category
   * @param unit
   * @param required
   * @param options
   * @description Cập nhật nội dung đánh giá
   * @return HttpResponse<ItemResponse> | HttpException
   * @page forms
   */
  @Put('items/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateItem(
    @Param('id') id: number,
    @Body() params: ItemDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ item_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ item_id: id, params }),
      );

      //#region Validation
      const valid = validateFormId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get jwt payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Update item
      const result = await updateItem(
        id,
        user_id,
        params,
        this._formService,
        this._itemServicve,
        this._optionService,
        this._titleService,
        this._dataSource,
        req,
      );
      //#endregion

      //#region Generate response
      if (result instanceof HttpException) throw result;
      return result;
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
