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
import { SERVER_EXIT_CODE } from 'src/constants/enums/error-code.enum';
import { Levels } from 'src/constants/enums/level.enum';
import { HandlerException } from 'src/exceptions/HandlerException';
import { HttpResponse } from 'src/interfaces/http-response.interface';
import { AcademicYearService } from 'src/modules/academic-year/services/academic_year.service';
import { JwtPayload } from 'src/modules/auth/interfaces/payloads/jwt-payload.interface';
import { FormService } from 'src/modules/form/services/form.service';
import { LogService } from 'src/modules/log/services/log.service';
import { SemesterService } from 'src/modules/semester/services/semester.service';
import { DataSource } from 'typeorm';
import { CreateFormDto } from '../dtos/add_form.dto';
import { createForm, updateForm } from '../funcs';
import { CreateFormResponse } from '../interfaces/form_response.interface';
import { FormmService } from '../service/service.service';
import { validateFormId } from '../validations';

@Controller('forms')
export class FormController {
  constructor(
    private readonly _formService: FormmService,
    private readonly _academicYearService: AcademicYearService,
    private readonly _semesterService: SemesterService,
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
   * @method PUT
   * @url /api/forms/:id
   * @access private
   * @description Cập nhật thông tin biểu mẫu
   * @return HttpResponse<CreateFormResponse> | HttpException
   * @page forms
   */
  @Put('id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateForm(
    @Param('id') id: number,
    @Body() params: CreateFormDto,
    @Req() req: Request,
  ): Promise<any> {
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
}
