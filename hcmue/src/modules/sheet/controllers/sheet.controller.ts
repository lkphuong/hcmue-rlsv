import {
  Controller,
  Post,
  Get,
  Put,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import {
  generateClassMarks,
  generateDepartmentMarks,
  generatePersonalMarks,
} from '../funcs';

import {
  generateApproveAllResponse,
  generateClassesResponse,
  generateClassSheetsResponse,
  generateEvaluationsResponse,
  generateItemsResponse,
  generateSheet,
  generateUserSheetsResponse,
} from '../utils';

import {
  validateClassId,
  validateDepartmentId,
  validateRole,
  validateSheetId,
  validateUserId,
} from '../validations';

import { ApproveAllDto } from '../dtos/approve_all.dto';

import { GetClassDto } from '../dtos/get_class.dto';
import { GetDetailTitleDto } from '../dtos/get_detail_item.dto';
import { GetSheetsByClassDto } from '../dtos/get_sheets_by_class.dto';

import { UpdateClassMarkDto } from '../dtos/update_class_mark.dto';
import { UpdateDepartmentMarkDto } from '../dtos/update_department_mark.dto';
import { UpdateStudentMarkDto } from '../dtos/update_student_mark.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { DepartmentService } from '../../department/services/department.service';
import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { KService } from '../../k/services/k.service';
import { LogService } from '../../log/services/log.service';
import { LevelService } from '../../level/services/level.service';
import { OptionService } from '../../option/services/option.service';
import { SheetService } from '../services/sheet.service';
import { UserService } from '../../user/services/user.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';

import {
  SheetDetailsResponse,
  BaseResponse,
  UserSheetsResponse,
  ItemsResponse,
  EvaluationsResponse,
  ClassSheetsResponse,
  ApproveAllResponse,
} from '../interfaces/sheet_response.interface';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('sheets')
export class SheetController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _classService: ClassService,
    private readonly _departmentService: DepartmentService,
    private readonly _evaluationService: EvaluationService,
    private readonly _headerService: HeaderService,
    private readonly _itemService: ItemService,
    private readonly _kService: KService,
    private readonly _levelService: LevelService,
    private readonly _optionService: OptionService,
    private readonly _sheetService: SheetService,
    private readonly _userService: UserService,
    private readonly _dataSource: DataSource,
    private readonly _logger: LogService,
  ) {
    // Due to transient scope, SheetController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(SheetController.name);
  }

  /**
   * @method GET
   * @url /api/sheets/:id
   * @access private
   * @param id
   * @description Get chi tiết phiếu
   * @return HttpResponse<SheetDetailsResponse> | HttpException
   * @page sheets page
   */
  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<SheetDetailsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ sheet_id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: id }),
      );

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get sheet
      const sheet = await this._sheetService.getSheetById(id);
      console.log('sheet: ', sheet);
      //#endregion
      if (sheet) {
        //#region Generate response
        return await generateSheet(
          sheet,
          this._departmentService,
          this._classService,
          this._userService,
          this._kService,
          req,
        );
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
   * @url /api/sheets/:id/items/:title_id
   * @access private
   * @param id
   * @param title_id
   * @description Hiển thị chi tiết điểm theo tiêu chí đánh giá
   * @return HttpResponse<ItemsResponse> | HttpException
   * @page sheets page
   */
  @Get(':id/items/:title_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getItemsByTitle(
    @Param() params: GetDetailTitleDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ItemsResponse> | HttpException> {
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
      const { id, title_id } = params;
      //#endregion

      const title = await this._itemService.contains(title_id, id);
      if (title) {
        //#region Generate response
        return generateItemsResponse(title, req);
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
   * @url /api/sheets/items/:id
   * @access private
   * @param id
   * @description Hiển thị chi tiết evaluations theo phiếu
   * @return HttpResponse<EvaluationsResponse> | HttpException
   * @page sheets page
   */
  @Get('items/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getEvaluationsBySheet(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<HttpResponse<EvaluationsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ sheet_id: id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: id }),
      );

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get evaluations by sheet_id
      const evaluations = await this._evaluationService.getEvaluationBySheetId(
        id,
      );
      //#endregion

      if (evaluations && evaluations.length > 0) {
        //#region Generate response
        return generateEvaluationsResponse(evaluations, req);
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
   * @url /api/sheets/student/:user_id
   * @access private
   * @param user_id
   * @description Hiển thị danh sách phiếu đánh giá cá nhân
   * @return  HttpResponse<UserSheetsResponse> | HttpException
   * @page sheets page
   */
  @Get('student/:user_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByUser(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ): Promise<HttpResponse<UserSheetsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ user_id: user_id }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ user_id: user_id }),
      );

      //#region Validation
      const valid = validateUserId(user_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get sheets by user
      const sheets = await this._sheetService.getSheetsByUserId(user_id);
      //#endregion
      console.log('sheet: ', sheets);
      if (sheets && sheets.length > 0) {
        //#region Generate response
        return generateUserSheetsResponse(sheets, req);
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
   * @method Post
   * @url /api/sheets/class/:class_id
   * @access private
   * @param class_id
   * @description Hiển thị danh sách phiếu đánh giá theo lớp
   * @return  HttpResponse<ClassSheetsResponse> | HttpException
   * @page sheets page
   */
  @Post('class/:class_id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByClass(
    @Param('class_id') class_id: string,
    @Body() params: GetSheetsByClassDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ClassSheetsResponse> | HttpException> {
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

      //#region Validation
      const valid = validateClassId(class_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get params
      const { role } = req.user as JwtPayload;
      const { academic_id, semester_id } = params;
      const input = params.input ?? null;
      //#endregion

      //#region Get sheets by class
      const sheets = await this._sheetService.getSheetsByClassId(
        academic_id,
        class_id,
        semester_id,
        role,
      );
      //#endregion

      const users = await this._userService.getUsersByClass(class_id, input);
      if (sheets && sheets.length > 0 && users) {
        //#region Generate response
        return await generateClassSheetsResponse(sheets, users, req);
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
   * @url /api/department/:department_id
   * @access private
   * @param department_id
   * @description Hiển thị danh sách lớp theo khoa
   * @return HttpResponse<BaseResponse> | HttpException | null
   * @page sheets page
   */
  @Post('department/:department_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassesByDepartment(
    @Param('department_id') department_id: string,
    @Body() params: GetClassDto,
    @Req() req: Request,
  ): Promise<HttpResponse<BaseResponse> | null | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ department_id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ department_id, params }),
      );

      //#region Validation
      const valid = validateDepartmentId(department_id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get params
      const { academic_id, class_id } = params;
      //#endregion

      //#region Get classess
      const academic_year =
        await this._academicYearService.getClassesByAcademic(
          academic_id,
          class_id,
        );
      //#endregion

      if (
        academic_year &&
        academic_year.classes &&
        academic_year.classes.length > 0
      ) {
        //#region Generate response
        return await generateClassesResponse(
          department_id,
          academic_year.classes,
          this._classService,
          req,
        );
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

  /**
   * @method PUT
   * @url /api/student/:id
   * @access private
   * @param id
   * @description Sinh viên cập nhật kết quả phiếu rèn luyện
   * @return HttpResponse<SheetDetailResponse> | HttpException
   * @page sheets page
   */
  @Put('student/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMarkStudent(
    @Param('id') id: number,
    @Body() params: UpdateStudentMarkDto,
    @Req() req: Request,
  ): Promise<HttpResponse<SheetDetailsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ sheet_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: id, params }),
      );

      //#region Validation
      const vali = validateSheetId(id, req);
      if (vali instanceof HttpException) throw vali;
      //#endregion

      //#region Get payload
      const { user_id } = req.user as JwtPayload;
      //#endregion

      //#region Update student sheet
      const sheet = await generatePersonalMarks(
        id,
        user_id,
        params,
        this._classService,
        this._departmentService,
        this._evaluationService,
        this._headerService,
        this._itemService,
        this._kService,
        this._levelService,
        this._optionService,
        this._sheetService,
        this._userService,
        this._dataSource,
        req,
      );
      //#endregion

      //#region Generate response
      if (sheet instanceof HttpException) throw sheet;
      else return sheet;
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
   * @url /api/class/:id
   * @access private
   * @description Lớp cập nhật kết quả phiếu rèn luyện
   * @return HttpResponse<SheetDetailsResponse> | HttpException
   * @page sheets page
   */
  @Put('class/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMarkClass(
    @Param('id') id: number,
    @Body() params: UpdateClassMarkDto,
    @Req() req: Request,
  ): Promise<HttpResponse<SheetDetailsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ sheet_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: id, params }),
      );

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const { user_id } = req.user as JwtPayload;

      //#region Update class sheet
      const sheet = await generateClassMarks(
        id,
        user_id,
        params,
        this._classService,
        this._departmentService,
        this._evaluationService,
        this._headerService,
        this._itemService,
        this._kService,
        this._levelService,
        this._optionService,
        this._sheetService,
        this._userService,
        this._dataSource,
        req,
      );
      //#endregion

      //#region Generate response
      if (sheet instanceof HttpException) throw sheet;
      else return sheet;
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
   * @url /api/department/:id
   * @access private
   * @description Khoa cập nhật kết quả phiếu rèn luyện
   * @return HttpResponse<SheetDetailsResponse> | HttpException
   * @page sheets page
   */
  @Put('department/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMarkDepartment(
    @Param('id') id: number,
    @Body() params: UpdateDepartmentMarkDto,
    @Req() req: Request,
  ): Promise<HttpResponse<SheetDetailsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ sheet_id: id, params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: id, params }),
      );

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const { user_id } = req.user as JwtPayload;

      //#region Update department sheet
      const sheet = await generateDepartmentMarks(
        id,
        user_id,
        params,
        this._classService,
        this._departmentService,
        this._evaluationService,
        this._headerService,
        this._itemService,
        this._kService,
        this._levelService,
        this._optionService,
        this._sheetService,
        this._userService,
        this._dataSource,
        req,
      );
      //#endregion

      //#region Generate response
      if (sheet instanceof HttpException) throw sheet;
      else return sheet;
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
   * @url /api/department/multi-approval
   * @access private
   * @description Khoa cập nhật kết quả cho nhiều sinh viên
   * @return HttpResponse<ApproveAllResponse> | HttpException
   * @page sheets page
   */
  @Put('department/approve-all')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async approveAll(
    @Body() params: ApproveAllDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ApproveAllResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Get params
      const { role_id, sheet_ids } = params;
      //#endregion

      const { role } = req.user as JwtPayload;

      //#region  Validate role
      const valid = await validateRole(role_id, role, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const success = await this._evaluationService.bulkApprove(sheet_ids);
      if (success) {
        //#region Generate response
        return generateApproveAllResponse(sheet_ids, success);
        //#endregion
      } else {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.OPERATOR_EVALUATION_ERROR,
          HttpStatus.EXPECTATION_FAILED,
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
