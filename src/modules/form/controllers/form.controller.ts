import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { HeaderService } from 'src/modules/header/services/header.service';
import { ItemService } from 'src/modules/item/services/item.service';
import { LogService } from 'src/modules/log/services/log.service';
import { TitleService } from 'src/modules/title/services/title.service';
import { FormService } from '../services/form.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';

import { HeaderResponse } from '../interfaces/header-response.interface';
import { TitleResponse } from '../interfaces/title-response.interface';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from 'src/constants/enums/error-code.enum';
import {
  generateResponseItems,
  generateResponseTitles,
  generateResponseHeaders,
  generateResponseForms,
  generateResponseForm,
} from '../utils';
import { ItemResponse } from '../interfaces/items-response.interface';
import { ErrorMessage } from '../constants/errors.enum';
import { FormInfoResponse } from '../interfaces/form_response.interface';
import { AcademicYearService } from 'src/modules/academic-year/services/academic_year.service';
import { SemesterService } from 'src/modules/semester/services/semester.service';
import { validateFormId, validateHeaderId } from '../validations';
import { UnknownException } from 'src/exceptions/UnknownException';
import { sprintf } from 'src/utils';
import { DataSource } from 'typeorm';
import { addHeader, updateHeader } from '../funcs';
import { UpdateHeaderDto } from '../dtos/update-header.dto';

@Controller('forms')
export class FormController {
  constructor(
    private readonly _formService: FormService,
    private readonly _headerService: HeaderService,
    private readonly _titleService: TitleService,
    private readonly _itemService: ItemService,
    private readonly _academicYearService: AcademicYearService,
    private readonly _semesterService: SemesterService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {
    // Due to transient scope, HeaderController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(FormController.name);
  }

  /**
   * @method GET
   * @url /api/forms/headers/:form_id
   * @access private
   * @description Hiển thị danh sách hạng mục đánh giá
   * @return HttpResponse<Class[]> | null | HttpException
   * @page
   */
  @Get('/headers/:form_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getHeadersByFormId(
    @Param('form_id') form_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<HeaderResponse[]> | HttpException> {
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

      //#region Get headers
      const headers = await this._headerService.getHeadersByFormId(form_id);
      //#endregion

      if (headers && headers.length > 0) {
        //#region Generate response
        return await generateResponseHeaders(headers, req);
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
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
   * @description Hiển thị danh sách nội dung chấm điểm (Item) theo tiêu chí đánh giá
   * @return HttpResponse<ItemResponse[]> | null | HttpException
   * @page
   */
  @Get('/items/:title_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getItemsByTitleId(
    @Param('title_id') title_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemResponse[]> | HttpException> {
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

      //#region Get items
      const items = await this._itemService.getItemsByTitleId(title_id);
      //#endregion

      if (items && items.length > 0) {
        //#region Generate items response
        return await generateResponseItems(items, req);
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
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
   * @description Hiển thị danh sách tiêu chí đánh giá
   * @return HttpResponse<TitleResponse[]> | null | HttpException
   * @page
   */
  @Get('/titles/:header_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getTitlesByHeaderId(
    @Param('header_id') header_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<TitleResponse[]> | HttpException> {
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

      //#region Get titles
      const titles = await this._titleService.getTitlesByHeaderId(header_id);
      //#endregion

      if (titles && titles.length > 0) {
        //#region Generate response
        return await generateResponseTitles(titles, req);
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
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
   * @url /api/forms
   * @access private
   * @description Hiển thị danh sách biểu mẫu
   * @return HttpResponse<TitleResponse[]> | null | HttpException
   * @page
   */
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getForms(
    @Req() req: Request,
  ): Promise<HttpResponse<FormInfoResponse[]> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + '');

      this._logger.writeLog(Levels.LOG, req.method, req.url, '');

      //#region Get forms
      const forms = await this._formService.getForms();
      //#endregion

      if (forms && forms.length > 0) {
        //#region Generate response
        return await generateResponseForms(forms, req);
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
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
   * @description Hiển thị chi tiết biểu mẫu
   * @return HttpResponse<FormInfoResponse> | null | HttpException
   * @page
   */
  @Get('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getFormById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<FormInfoResponse> | HttpException> {
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
        return await generateResponseForm(form, req);
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
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
   * @description Thêm hạng mục đánh giá (Header) cho biểu mẫu
   * @return HttpResponse<HeaderResponse> | null | HttpException
   * @page
   */
  @Put('/headers')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async addHeaders(
    @Body() params: UpdateHeaderDto,
    @Req() req: Request,
  ): Promise<HttpResponse<HeaderResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      const header = await addHeader(
        params,
        this._headerService,
        this._formService,
        this._dataSource,
        req,
      );

      //#region Generate response
      if (header instanceof HttpException) throw header;
      else return header;
      //#endregion
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
   * @description Cập nhật hạng mục đánh giá (Header) cho biểu mẫu
   * @return HttpResponse<HeaderResponse> | null | HttpException
   * @page
   */
  @Put('/headers/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async updateHeaders(
    @Param('id') id: number,
    @Body() params: UpdateHeaderDto,
    @Req() req: Request,
  ): Promise<HttpResponse<HeaderResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Validate id
      const valid = validateHeaderId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const header = await updateHeader(
        id,
        params,
        this._headerService,
        this._formService,
        this._dataSource,
        req,
      );

      //#region Generate response
      if (header instanceof HttpException) throw header;
      else return header;
      //#endregion
    } catch (e) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + e.message);

      if (e instanceof HttpException) throw e;
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
