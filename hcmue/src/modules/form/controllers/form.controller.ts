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
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { convertString2Date, returnObjects, sprintf } from '../../../utils';

import {
  generateDetailFormResponse,
  generateFormResponse,
  generateFormsResponse,
  generateHeadersResponse,
  generateItemsResponse,
  generateTitlesResponse,
} from '../utils';

import {
  cloneForm,
  createForm,
  createHeader,
  createItem,
  createTitle,
  setFormStatus,
  unlinkForm,
  unlinkHeader,
  unlinkItem,
  unlinkTitle,
  updateForm,
  updateHeader,
  updateItem,
  updateTitle,
} from '../funcs';

import {
  isAnyListUsers,
  isAnyPublished,
  valiadteTitle,
  validateForm,
  validateFormId,
  validateFormPubishStatus,
  validateFormUnPubishStatus,
  validateHeader,
  validateHeaderId,
  validateItemDto,
  validateItemId,
  validateTimePublish,
  validateTitleId,
} from '../validations';

import { HeaderDto } from '../dtos/header.dto';
import { FormDto } from '../dtos/form.dto';
import { GetFormDto } from '../dtos/get_form.dto';
import { TitleDto } from '../dtos/title.dto';
import { ItemDto } from '../dtos/item.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { FormService } from '../services/form.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { LogService } from '../../log/services/log.service';
import { OptionService } from '../../option/services/option.service';
import { SemesterService } from '../../semester/services/semester.service';
import { TitleService } from '../../title/services/title.service';
import { UserService } from '../../user/services/user.service';

import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';
import { HttpResponse } from '../../../interfaces/http-response.interface';
import {
  BaseResponse,
  DetailFormResponse,
  FormResponse,
  HeaderResponse,
  ItemResponse,
} from '../interfaces/form-response.interface';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { HandlerException } from '../../../exceptions/HandlerException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Role } from '../../auth/constants/enums/role.enum';

import { FormStatus } from '../constants/enums/statuses.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

import { Levels } from '../../../constants/enums/level.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('forms')
export class FormController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _formService: FormService,
    private readonly _headerService: HeaderService,
    private readonly _itemService: ItemService,
    private readonly _optionService: OptionService,
    private readonly _semesterService: SemesterService,
    private readonly _titleService: TitleService,
    private readonly _userService: UserService,
    private readonly _configurationService: ConfigurationService,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {
    // Due to transient scope, FormController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(FormController.name);
  }

  /**
   * @method GET
   * @url /api/forms/timeline
   * @access private
   * @description Hiển thị thời gian chấm điểm
   * @return HttpResponse<> | HttpException | null
   * @page forms page
   */
  @Get('timeline')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getTimeline(@Req() req: Request) {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get form in progress
      const form = await this._formService.getFormInProgress();
      //#endregion

      if (form) {
        return returnObjects({
          start: convertString2Date(form.start.toString()),
          end: convertString2Date(form.end.toString()),
          semester_id: form.semester_id,
          academic_id: form.academic_id
        });
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
   * @url /api/forms
   * @access private
   * @description Hiển thị danh sách biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Post('all')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getForms(
    @Body() params: GetFormDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<FormResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + JSON.stringify({ params: params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params: params }),
      );

      //#region Get params
      const { academic_id, page, semester_id, status } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get pages
      if (pages == 0) {
        //#region Count
        const count = await this._formService.countForms(
          academic_id,
          semester_id,
          status,
        );

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }
      //#endregion

      //#region Get forms
      const forms = await this._formService.getForms(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        academic_id,
        semester_id,
        status,
      );
      //#endregion
      if (forms && forms.length > 0) {
        //#region Generate response
        return await generateFormsResponse(pages, page, forms, req);
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
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
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
        throw new UnknownException(
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
   * @url /api/forms/detail/:id
   * @access private
   * @param id
   * @description Hiển thị chi tiết biểu mẫu
   * @return HttpResponse<DetailFormResponse> | HttpException | null
   * @page forms page
   */
  @Get('detail/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async getDetailFormById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<DetailFormResponse> | HttpException> {
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
      const form = await this._formService.getDetailFormById(id);
      if (form) {
        //#region Generate response
        return await generateDetailFormResponse(form, null, req);
        //#endregion
      } else {
        //#region throw HandlerException
        throw new UnknownException(
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
        //#region Validate
        //#region Validate form status
        valid = validateFormPubishStatus(form, req);
        if (valid instanceof HttpException) throw valid;
        //#endregion

        //#region Validate check if any form published in academic year and semester
        valid = await isAnyPublished(
          form.academic_year.id,
          form.semester.id,
          this._formService,
          req,
        );

        if (valid instanceof HttpException) throw valid;
        //#endregion

        //#region Validate check any list of users belong to academic year and semester
        valid = await isAnyListUsers(
          form.academic_year.id,
          form.semester.id,
          this._userService,
          req,
        );
        if (valid instanceof HttpException) throw valid;
        //#endregion

        //#endregion

        //#region Validate time publish
        const valid_time = validateTimePublish(form.start, req);
        if (valid_time instanceof HttpException) throw valid_time;
        //#endregion

        //#region Get jwt payload
        const { username: request_code } = req.user as JwtPayload;
        //#endregion

        //#region Set form status
        return await setFormStatus(
          request_code,
          FormStatus.PUBLISHED,
          form,
          this._formService,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        throw new UnknownException(
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
        const { username: request_code } = req.user as JwtPayload;
        //#endregion

        //#region Set form status
        return await setFormStatus(
          request_code,
          FormStatus.DRAFTED,
          form,
          this._formService,
          req,
        );
        //#endregion
      } else {
        //#region throw HandlerException
        throw new UnknownException(
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
      //#region Validate FormId
      const valid = validateFormId(form_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate Form
      const form = await validateForm(form_id, this._formService, req);
      if (form instanceof HttpException) throw form;
      //#endregion
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
      //#region Validate headerId
      const valid = validateHeaderId(header_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#region Validate Header
      const header = await validateHeader(header_id, this._headerService, req);
      if (header instanceof HttpException) throw header;
      //#endregion
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
      //#region Validate TitleId
      const valid = validateTitleId(title_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#region Validate Title
      const title = await valiadteTitle(title_id, this._titleService, req);
      if (title instanceof HttpException) throw title;
      //#endregion
      //#endregion

      //#region Get items
      const items = await this._itemService.getItemsByTitleId(title_id);
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Create form
      const form = await createForm(
        request_code,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Create header
      const header = await createHeader(
        request_code,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Create title
      const result = await createTitle(
        request_code,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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

      //#region Validate item dto
      const valid = validateItemDto(params, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Create item
      const result = await createItem(
        request_code,
        params,
        this._formService,
        this._itemService,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Update form
      const form = await updateForm(
        id,
        request_code,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Update header
      const header = await updateHeader(
        id,
        request_code,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Update title
      const result = await updateTitle(
        id,
        request_code,
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
   * @url /api/forms/items/:id
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
      //#region Validate item id
      let valid = validateItemId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate item dto
      valid = validateItemDto(params, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Update item
      const result = await updateItem(
        id,
        request_code,
        params,
        this._formService,
        this._itemService,
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

  /**
   * @method DELETE
   * @url /api/forms/publish/:id
   * @access private
   * @param id
   * @description Xoá biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async unlinkForm(
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

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Unlink form
      const form = await unlinkForm(id, request_code, this._formService, req);
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
   * @url /api/forms/clone/:id
   * @access private
   * @param id
   * @description Clone biểu mẫu
   * @return HttpResponse<FormResponse> | HttpException | null
   * @page forms page
   */
  @Post('clone/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async cloneForm(
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

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Clone form
      const form = await cloneForm(
        id,
        request_code,
        this._formService,
        this._headerService,
        this._itemService,
        this._optionService,
        this._titleService,
        this._dataSource,
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
   * @method DELETE
   * @url /api/forms/:form_id/headers/:header_id
   * @access private
   * @param form_id
   * @param header_id
   * @description Xóa hạng mục đánh giá (Header) cho biểu mẫu
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms
   */
  @Delete(':form_id/headers/:header_id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @HttpCode(HttpStatus.OK)
  async unlinkHeader(
    @Param('form_id') form_id: number,
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
          JSON.stringify({ form_id, header_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ form_id, header_id }),
      );

      //#region Validation
      //#region Validate form_id
      let valid = validateFormId(form_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate header_id
      valid = validateHeaderId(header_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Update header
      const header = await unlinkHeader(
        form_id,
        header_id,
        request_code,
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
   * @method DELETE
   * @url /api/forms/:form_id/titles/:title_id
   * @access private
   * @param form_id
   * @param title_id
   * @description Xoá tiêu chí đánh giá
   * @return HttpResponse<BaseResponse> | HttpException
   * @page forms page
   */
  @Delete(':form_id/titles/:title_id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async unlinkTitle(
    @Param('form_id') form_id: number,
    @Param('title_id') title_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ form_id, title_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ form_id, title_id }),
      );

      //#region Validation
      //#region Validate form_id
      let valid = validateFormId(form_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate title_id
      valid = validateTitleId(title_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Unlink title
      const title = await unlinkTitle(
        form_id,
        title_id,
        request_code,
        this._formService,
        this._titleService,
        req,
      );
      //#endregion

      //#region Generate response
      if (title instanceof HttpException) throw title;
      return title;
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
   * @method DELETE
   * @url /api/forms/:form_id/items/:item_id
   * @access private
   * @param form_id
   * @param item_id
   * @description Xoá nội dung đánh giá
   * @return HttpResponse<ItemResponse> | HttpException
   * @page forms page
   */
  @Delete(':form_id/items/:item_id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async unlinkItem(
    @Param('form_id') form_id: number,
    @Param('item_id') item_id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ form_id, item_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ form_id, item_id }),
      );

      //#region Validation
      //#region Validate form_id
      let valid = validateFormId(form_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Validate item_id
      valid = validateItemId(item_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Get jwt payload
      const { username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Unlink item
      const result = await unlinkItem(
        form_id,
        item_id,
        request_code,
        this._formService,
        this._itemService,
        this._optionService,
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
