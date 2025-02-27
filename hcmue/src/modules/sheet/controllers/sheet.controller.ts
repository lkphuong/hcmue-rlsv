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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import {
  generateAdviserMarks,
  generateCategoryByRole,
  generateClassMarks,
  generateDepartmentMarks,
  generatePersonalMarks,
  generateUngradeSheet,
} from '../funcs';

import {
  generateApproveAllResponse,
  generateClassesResponse,
  generateClassStatusAdviserHistoryResponse,
  generateClassStatusAdviserResponse,
  generateClassStatusDepartmentResponse,
  generateDepartmentStatusResponse,
  generateEvaluationsResponse,
  generateFailedResponse,
  generateItemsResponse,
  generateObjectIdFromUsers,
  generateResponses,
  generateSheet,
  generateSheetsResponses,
  generateUserSheetsPagingResponse,
  generateUserSheetsResponse,
} from '../utils';
import { returnObjects } from '../../../utils';

import {
  validateAcademic,
  validateClass,
  validateDepartment,
  validateDepartmentId,
  validateSemester,
  validateSheet,
  validateSheetId,
  validateStudentRole,
  validateUserId,
} from '../validations';

import { UserEntity } from '../../../entities/user.entity';

import { ApproveAllDto } from '../dtos/approve_all.dto';
import { GetAllSheetsByClassDto } from '../dtos/get_all_sheets_by_class.dto';
import { GetClassDto } from '../dtos/get_class.dto';
import { GetClassStatusAdviserDto } from '../dtos/get_classes_status_adviser.dto';
import { GetClassStatusAdviserHistoryDto } from '../dtos/get_classes_status_adviser_history.dto';
import { GetClassStatusDepartmentDto } from '../dtos/get_classes_status_department.dto';
import { GetClassStatusDepartmentHistoryDto } from '../dtos/get_classes_status_department_history.dto';
import { GetDepartmentStatusDto } from '../dtos/get_department_status.dto';
import { GetDepartmentStatusHistoryDto } from '../dtos/get_department_status_history.dto';
import { GetDetailTitleDto } from '../dtos/get_detail_item.dto';
import { GetSheetsByAdminDto } from '../dtos/get_sheets_admin.dto';
import { GetSheetsByClassDto } from '../dtos/get_sheets_by_class.dto';
import { GetSheetStudentHistoryDto } from '../dtos/get_sheets_history.dto';
import { UpdateAdviserMarkDto } from '../dtos/update_adviser_mark.dto';
import { UpdateClassMarkDto } from '../dtos/update_class_mark.dto';
import { UpdateDepartmentMarkDto } from '../dtos/update_department_mark.dto';
import { UpdateStudentMarkDto } from '../dtos/update_student_mark.dto';

import { AcademicYearService } from '../../academic-year/services/academic_year.service';
import { ClassService } from '../../class/services/class.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { DepartmentService } from '../../department/services/department.service';
import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { FilesService } from '../../file/services/files.service';
import { FormService } from '../../form/services/form.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { OtherService } from '../../other/services/other.service';
import { LevelService } from '../../level/services/level.service';
import { LogService } from '../../log/services/log.service';
import { OptionService } from '../../option/services/option.service';
import { SemesterService } from '../../semester/services/semester.service';
import { SheetService } from '../services/sheet.service';
import { HistoryService } from '../../history/services/history.service';
import { UserService } from '../../user/services/user.service';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { HttpPagingResponse } from '../../../interfaces/http-paging-response.interface';

import {
  SheetDetailsResponse,
  BaseResponse,
  UserSheetsResponse,
  EvaluationsResponse,
  ClassSheetsResponse,
  ApproveAllResponse,
  ClassStatusResponse,
  ClassResponse,
  ManagerDepartmentResponse,
} from '../interfaces/sheet_response.interface';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { HandlerException } from '../../../exceptions/HandlerException';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { FormStatus } from '../../form/constants/enums/statuses.enum';
import { UnknownException } from '../../../exceptions/UnknownException';
import { SheetLevel } from '../constants/enums/level.enum';
import { SheetStatus } from '../constants/enums/status.enum';
import { RateLimitInterceptor } from '../../../exceptions/limit-rate-exception';

@Controller('sheets')
export class SheetController {
  constructor(
    private readonly _academicYearService: AcademicYearService,
    private readonly _classService: ClassService,
    private readonly _departmentService: DepartmentService,
    private readonly _evaluationService: EvaluationService,
    private readonly _fileService: FilesService,
    private readonly _formService: FormService,
    private readonly _headerService: HeaderService,
    private readonly _itemService: ItemService,
    private readonly _otherService: OtherService,
    private readonly _levelService: LevelService,
    private readonly _optionService: OptionService,
    private readonly _sheetService: SheetService,
    private readonly _historyService: HistoryService,
    private readonly _semesterService: SemesterService,
    private readonly _userService: UserService,
    private readonly _dataSource: DataSource,
    private readonly _configurationService: ConfigurationService,
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

      const { role, username } = req.user as JwtPayload;

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;

      //#endregion

      //#region Get sheet
      const sheet = await this._sheetService.getSheetById(id);
      //#endregion
      if (sheet) {
        //#region Validate role
        const valid = await validateStudentRole(
          role,
          username,
          sheet.std_code,
          this._userService,
          req,
        );
        if (valid instanceof HttpException) throw valid;
        //#endregion
        //#region Generate response
        return await generateSheet(sheet, role, req);
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
  ): Promise<HttpResponse<EvaluationsResponse> | HttpException> {
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

      const { role } = req.user as JwtPayload;

      const title = await this._itemService.contains(title_id, id);

      if (title && title.length > 0) {
        const base_url = this._configurationService.get(
          Configuration.BASE_URL,
        ) as string;
        //#region Generate response
        return await generateItemsResponse(
          role,
          title,
          base_url,
          this._fileService,
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
   * @url /api/sheets/items/:id
   * @access private
   * @param id
   * @description Hiển thị chi tiết evaluations theo phiếu
   * @return HttpResponse<EvaluationsResponse> | HttpException
   * @page sheets page
   */
  @Get('items/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getItemsBySheetId(
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

      const { role } = req.user as JwtPayload;

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      //#region Get evaluations by sheet_id
      const [evaluations, sheet] = await Promise.all([
        this._evaluationService.getEvaluationBySheetId(id),
        this._sheetService.getSheet(id),
      ]);

      //#endregion

      if (evaluations && evaluations.length > 0 && sheet) {
        const base_url = this._configurationService.get(
          Configuration.BASE_URL,
        ) as string;
        //#region Generate response
        return await generateEvaluationsResponse(
          role,
          evaluations,
          sheet,
          base_url,
          this._fileService,
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
   * @method Post
   * @url /api/sheets/class/:class_id
   * @access private
   * @param class_id
   * @description Hiển thị danh sách phiếu đánh giá theo lớp không phân trang
   * @return  HttpResponse<ClassSheetsResponse> | HttpException
   * @page sheets page
   */
  @Post('class/all')
  @UseGuards(JwtAuthGuard)
  @Roles(
    Role.ADMIN,
    Role.DEPARTMENT,
    Role.MONITOR,
    Role.SECRETARY,
    Role.CHAIRMAN,
    Role.ADVISER,
  )
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getAllSheetsByClass(
    @Body() params: GetAllSheetsByClassDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ClassSheetsResponse> | HttpException> {
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
      const {
        academic_id,
        department_id,
        input,
        semester_id,
        class_id,
        status,
      } = params;

      let users: UserEntity[] = null;
      let user_ids: string[] = null;
      //#endregion

      //#region Validation
      //#region Validate class
      const $class = validateClass(class_id, this._classService, req);

      if ($class instanceof HttpException) throw $class;
      //#endregion

      //#region Validate department
      const department = validateDepartment(
        department_id,
        this._departmentService,
        req,
      );

      if (department instanceof HttpException) throw department;
      //#endregion

      //#endregion

      //#region Get users if input != null
      if (input) {
        users = await this._userService.getUsersByInput(
          academic_id,
          semester_id,
          class_id,
          department_id,
          input,
        );

        user_ids = generateObjectIdFromUsers(users);
        if (!user_ids) {
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
      }
      //#endregion

      //#region Get sheets
      const sheets = await this._sheetService.getSheets(
        department_id,
        class_id,
        academic_id,
        semester_id,
        status,
        user_ids,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        //#region Generate reponse
        return generateSheetsResponses(sheets, req);
        //#endregion
      }

      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
      );
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
   * @method Post
   * @url /api/sheets/admin/class
   * @access private
   * @param pages
   * @param pages
   * @param department_id
   * @param class_id
   * @param semester_id
   * @param academic_id
   * @param status
   * @param input?
   * @description Hiển thị danh sách phiếu đánh giá theo lớp
   * @return  HttpResponse<ClassSheetsResponse> | HttpException
   * @page sheets page
   */
  @Post('admin/class')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByAdmin(
    @Body() params: GetSheetsByAdminDto,
    @Req() req: Request,
  ) {
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
      const {
        academic_id,
        class_id,
        department_id,
        semester_id,
        input,
        page,
        status,
      } = params;

      let { pages } = params;
      let users: UserEntity[] = null;
      let user_ids: string[] = null;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get users if input != null
      if (input) {
        users = await this._userService.getUsersByInput(
          academic_id,
          semester_id,
          class_id,
          department_id,
          input,
        );

        if (users && users.length > 0) {
          user_ids = generateObjectIdFromUsers(users);
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
      }
      //#endregion

      //#region Get pages
      let count = 0;
      if (pages === 0) {
        //#region Count
        count = await this._sheetService.countSheets(
          academic_id,
          class_id,
          department_id,
          semester_id,
          status,
          user_ids,
        );

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }
      //#endregion

      //#region Get sheets
      const sheets = await this._sheetService.getSheetsPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        department_id,
        class_id,
        academic_id,
        semester_id,
        status,
        user_ids,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        //#region Generate reponse
        return generateResponses(pages, page, count, sheets, null, null, req);
        //#endregion
      }

      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
      );
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
   * @url /api/sheets/student/:user_id
   * @access private
   * @param user_id
   * @description Hiển thị danh sách phiếu đánh giá cá nhân
   * @return  HttpResponse<UserSheetsResponse> | HttpException
   * @page sheets page
   */
  @Get('student/:std_code')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByUser(
    @Param('std_code') std_code: string,
    @Req() req: Request,
  ): Promise<HttpResponse<UserSheetsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method +
          ' - ' +
          req.url +
          ': ' +
          JSON.stringify({ std_code: std_code }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ std_code: std_code }),
      );

      //#region Get Jwt Payload
      const { role, username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate std_code
      let valid = validateUserId(std_code, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#region Validate role
      valid = await validateStudentRole(
        role,
        request_code,
        std_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion
      //#region Get sheets by user
      const sheets = await this._sheetService.getSheetsByCode(std_code);
      //#endregion

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
   * @method POST
   * @url /api/sheets/student/:std_code/history
   * @access private
   * @param std_code
   * @description Hiển thị danh sách phiếu đánh giá cá nhân
   * @return  HttpResponse<UserSheetsResponse> | HttpException
   * @page sheets page
   */
  @Post('student/history')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsHistoryByUser(
    @Body() params: GetSheetStudentHistoryDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<UserSheetsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params }),
      );

      //#region Get Jwt Payload
      const { role, username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { page, std_code } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Validation
      //#region Validate std_code
      let valid = validateUserId(std_code, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#region Validate role
      valid = await validateStudentRole(
        role,
        request_code,
        std_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      if (pages === 0) {
        const count = await this._sheetService.countSheetsHistoryByCode(
          std_code,
        );

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
      }

      //#region Get sheets by user
      const sheets = await this._sheetService.getSheetsHistoryPagingByCode(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        std_code,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        //#region Generate response
        return generateUserSheetsPagingResponse(pages, page, sheets, req);
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
   * @url /api/sheets/adviser/
   * @access private
   * @param class_id
   * @param department_id
   * @description Hiển thị danh sách phiếu cho cố vấn học tập
   * @return HttpResponse<ClassStatusResponse> | HttpException
   * @page sheets page
   */
  @Post('adviser')
  @Roles(
    Role.ADMIN,
    Role.DEPARTMENT,
    Role.ADVISER,
    Role.MONITOR,
    Role.SECRETARY,
    Role.CHAIRMAN,
  )
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassStatus(
    @Body() params: GetClassStatusAdviserDto,
    @Req() req: Request,
  ): Promise<HttpResponse<ClassStatusResponse> | HttpException> {
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

      //#region Get jwtpayload
      const { role } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { class_ids } = params;
      //#endregion

      //#region Get form in progress
      const form = await this._formService.getFormInProgress();
      //#endregion

      //#region Get Class
      const $class = await this._classService.getClassByIds(class_ids);
      //#endregion

      if (form && $class) {
        //#region Count sheet status < status waitting class
        return await generateClassStatusAdviserResponse(
          role,
          form,
          $class,
          this._sheetService,
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
   * @method POST
   * @url /api/sheets/adviser/history
   * @access private
   * @param class_id
   * @param department_id
   * @description Hiển thị lịch sử phiếu cho cố vấn học tập
   * @return HttpPagingResponse<ClassResponse> | HttpException
   * @page sheets page
   */
  @Post('adviser/history')
  @Roles(
    Role.ADMIN,
    Role.DEPARTMENT,
    Role.ADVISER,
    Role.MONITOR,
    Role.SECRETARY,
    Role.CHAIRMAN,
  )
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassStatusHistory(
    @Body() params: GetClassStatusAdviserHistoryDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ClassResponse> | HttpException> {
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

      //#region Get jwtpayload
      const { role } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { page, academic_id, semester_id, class_id } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      if (pages === 0) {
        //#region Get pages
        const count = await this._formService.countForms(
          academic_id,
          semester_id,
          FormStatus.DONE,
        );

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }

      const forms = await this._formService.getForms(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        academic_id,
        semester_id,
        FormStatus.DONE,
      );

      const $class = await this._classService.getClassById(class_id);

      if (forms && forms.length > 0 && $class) {
        return await generateClassStatusAdviserHistoryResponse(
          role,
          pages,
          page,
          params,
          forms,
          $class,
          this._sheetService,
          req,
        );
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
  @UseGuards(JwtAuthGuard)
  @Roles(
    Role.ADMIN,
    Role.DEPARTMENT,
    Role.MONITOR,
    Role.SECRETARY,
    Role.CHAIRMAN,
    Role.ADVISER,
    Role.STUDENT,
  )
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByClass(
    @Param('class_id') class_id: number,
    @Body() params: GetSheetsByClassDto,
    @Req() req: Request,
  ) {
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
      const { academic_id, department_id, input, page, semester_id, status } =
        params;

      let { pages } = params;
      let users: UserEntity[] = null;
      let user_ids: string[] = null;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Validation
      //#region Validate class
      const $class = validateClass(class_id, this._classService, req);

      if ($class instanceof HttpException) throw $class;
      //#endregion

      //#region Validate semester
      const semester = await validateSemester(
        semester_id,
        this._semesterService,
        req,
      );
      if (semester instanceof HttpException) throw semester;
      //#endregion

      //#region Validate academic year
      const academic_year = await validateAcademic(
        academic_id,
        this._academicYearService,
        req,
      );
      if (academic_year instanceof HttpException) throw academic_year;
      //#endregion

      //#region Validate department
      const department = validateDepartment(
        department_id,
        this._departmentService,
        req,
      );

      if (department instanceof HttpException) throw department;
      //#endregion

      //#endregion

      //#region Get users if input != null
      if (input) {
        users = await this._userService.getUsersByInput(
          academic_id,
          semester_id,
          class_id,
          department_id,
          input,
        );

        user_ids = generateObjectIdFromUsers(users);

        if (!user_ids) {
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
      }
      //#endregion

      //#region Get pages
      let count = 0;
      if (pages === 0) {
        //#region Count
        count = await this._sheetService.countSheets(
          academic_id,
          class_id,
          department_id,
          semester_id,
          status,
          user_ids,
        );

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }
      //#endregion

      //#region Get sheets
      const sheets = await this._sheetService.getSheetsPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        department_id,
        class_id,
        academic_id,
        semester_id,
        status,
        user_ids,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        //#region Generate reponse
        return generateResponses(
          pages,
          page,
          count,
          sheets,
          semester,
          academic_year,
          req,
        );
        //#endregion
      }

      //#region throw HandlerException
      throw new HandlerException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMessage.NO_CONTENT,
        HttpStatus.NOT_FOUND,
      );
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
   * @url /api/sheets/department
   * @access private
   * @param department_id
   * @param pages
   * @param page
   * @description Hiển thị danh sách tình trạng biểu mẫu cho khoa
   * @return HttpPagingResponse<ClassResponse> | HttpException
   * @page sheets page
   */
  @Post('department')
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassStatusDepartment(
    @Body() params: GetClassStatusDepartmentDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ClassStatusResponse> | HttpException> {
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
      const { department_id, page } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get form in progress
      const form = await this._formService.getFormInProgress();
      //#endregion

      if (form) {
        if (pages === 0) {
          //#region Get pages
          const count = await this._classService.count(department_id);

          if (count > 0) pages = Math.ceil(count / itemsPerPage);
          //#endregion
        }

        const classes = await this._classService.getClassesByDepartmentIdPaging(
          (page - 1) * itemsPerPage,
          itemsPerPage,
          department_id,
        );

        if (classes && classes.length > 0) {
          return await generateClassStatusDepartmentResponse(
            pages,
            page,
            form.academic_year.id,
            form.semester.id,
            department_id,
            classes,
            this._academicYearService,
            this._semesterService,
            this._sheetService,
            req,
          );
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
   * @url api/sheets/department/history
   * @access private
   * @param pages
   * @param page
   * @description Hiển thị danh sách lịch sử tình trạng biểu mẫu cho khoa
   * @return HttpPagingResponse<ClassResponse> | HttpException
   * @page sheet page
   */
  @Post('department/history')
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassStatusDepartmentHistory(
    @Body() params: GetClassStatusDepartmentHistoryDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ClassStatusResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params }),
      );

      //#region Get params
      const { academic_id, department_id, page, semester_id } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get form
      const form = await this._formService.isAnyPublish(
        semester_id,
        academic_id,
      );
      //#endregion

      if (form && form.status == FormStatus.DONE) {
        if (pages === 0) {
          //#region get pages
          const count = await this._classService.count(department_id);

          if (count > 0) pages = Math.ceil(count / itemsPerPage);
          //#endregion
        }

        const classes = await this._classService.getClassesByDepartmentIdPaging(
          (page - 1) * itemsPerPage,
          itemsPerPage,
          department_id,
        );

        if (classes && classes.length > 0) {
          return await generateClassStatusDepartmentResponse(
            pages,
            page,
            academic_id,
            semester_id,
            department_id,
            classes,
            this._academicYearService,
            this._semesterService,
            this._sheetService,
            req,
          );
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
   * @url api/sheets/admin
   * @access private
   * @param department_id
   * @description Danh sachs trạng thái chấm điểm của cấc khoa
   * @page sheets page
   */
  @Post('admin')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getDepartmentStatus(
    @Body() params: GetDepartmentStatusDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ManagerDepartmentResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params }),
      );

      //#region Get params
      const { page, department_id } = params;
      // let { pages } = params;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get form
      const form = await this._formService.getFormInProgress();
      //#endregion
      if (form) {
        // if (pages === 0) {
        //   //#region get pages
        //   const count = await this._departmentService.count(department_id);

        //   if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //   //#endregion
        // }

        const departments = await this._departmentService.getDepartmentPaging(
          (page - 1) * itemsPerPage,
          itemsPerPage,
          department_id,
          null,
          form.academic_year.id,
          form.semester.id,
        );
        if (departments && departments.length > 0) {
          return await generateDepartmentStatusResponse(
            3,
            page,
            form.academic_year,
            form.semester,
            departments,
            this._sheetService,
            req,
          );
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
   * @url api/sheets/admin
   * @access private
   * @param department_id
   * @description Danh sachs trạng thái chấm điểm của cấc khoa
   * @page sheets page
   */
  @Post('admin/history')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getDepartmentStatusHistory(
    @Body() params: GetDepartmentStatusHistoryDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ManagerDepartmentResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(
        req.method + ' - ' + req.url + ': ' + JSON.stringify({ params }),
      );

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ params }),
      );

      //#region Get params
      const { page, academic_id, department_id, semester_id } = params;
      let { pages } = params;

      //#region Validataion
      //#region validate academic
      const valid_academic = await validateAcademic(
        academic_id,
        this._academicYearService,
        req,
      );
      if (valid_academic instanceof HttpException) throw valid_academic;
      //#endregion
      //#region Validate semester
      const valid_semester = await validateSemester(
        semester_id,
        this._semesterService,
        req,
      );
      if (valid_semester instanceof HttpException) throw valid_semester;
      //#endregion
      //#endregion

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get form
      const form = await this._formService.isAnyPublish(
        semester_id,
        academic_id,
      );
      //#endregion
      if (form && form.status == FormStatus.DONE) {
        if (pages === 0) {
          //#region get pages
          const count = await this._departmentService.count(department_id);

          if (count > 0) pages = Math.ceil(count / itemsPerPage);
          //#endregion
        }

        const departments = await this._departmentService.getDepartmentPaging(
          (page - 1) * itemsPerPage,
          itemsPerPage,
          department_id,
        );
        if (departments && departments.length > 0) {
          return await generateDepartmentStatusResponse(
            pages,
            page,
            valid_academic,
            valid_semester,
            departments,
            this._sheetService,
            req,
          );
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassesByDepartment(
    @Param('department_id') department_id: number,
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
      const { class_id, page } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      if (pages === 0) {
        //#region Get pages
        const count = await this._classService.count(department_id);

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }

      //#region Get classess
      const classes = await this._classService.getClassesByDepartmentIdPaging(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        department_id,
        class_id,
      );
      //#endregion

      if (classes && classes.length > 0) {
        //#region Generate response
        return await generateClassesResponse(classes, req);
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  @Roles(Role.STUDENT, Role.MONITOR, Role.CHAIRMAN, Role.SECRETARY)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMarkStudent(
    @Param('id') id: number,
    @Body() params: UpdateStudentMarkDto,
    @Req() req: Request,
  ): Promise<HttpResponse<SheetDetailsResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ sheet_id: id, params }),
      );

      //#region Get payload
      const { role, username } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate sheet
      const sheet = await validateSheet(id, this._sheetService, role, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion

      //#region Validate Expired Form

      //#endregion

      //#region Validate role
      const valid = await validateStudentRole(
        role,
        username,
        sheet.std_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
      //#endregion
      //#endregion

      //#region Update student sheet
      const result = await generatePersonalMarks(
        username,
        role,
        params,
        sheet,
        this._evaluationService,
        this._fileService,
        this._headerService,
        this._itemService,
        this._levelService,
        this._optionService,
        this._sheetService,
        this._dataSource,
        req,
      );
      //#endregion

      //#region Generate response
      if (result instanceof HttpException) throw result;
      else return result;
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  // @Roles(Role.MONITOR, Role.SECRETARY, Role.CHAIRMAN)
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

      //#region Get payload
      const { role, username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { graded } = params;
      //#endregion
      //#region Validation
      //#region Validate sheet
      const sheet = await validateSheet(id, this._sheetService, role, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion
      //#endregion

      if (graded) {
        //#region Graded & update class marks
        const result = await generateClassMarks(
          request_code,
          role,
          params,
          sheet,
          this._evaluationService,
          this._headerService,
          this._itemService,
          this._levelService,
          this._optionService,
          this._sheetService,
          this._dataSource,
          req,
        );
        //#endregion
        //#region Generate response
        if (result instanceof HttpException) throw result;
        else return result;
        //#endregion
      } else {
        //#region Ungraded
        const result = await generateUngradeSheet(
          request_code,
          role,
          sheet,
          this._sheetService,
          req,
        );
        //#endregion

        //#region Generate response
        if (result instanceof HttpException) throw result;
        else return result;
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
   * @method PUT
   * @url /api/adviser/:id
   * @access private
   * @description Cố vấn học tập cập nhật kết quả phiếu rèn luyện
   * @return HttpResponse<SheetDetailsResponse> | HttpException
   * @page sheets page
   */
  @Put('adviser/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMarkAdviser(
    @Param('id') id: number,
    @Body() params: UpdateAdviserMarkDto,
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
        JSON.stringify({ sheet_id: id, params }),
      );

      //#region Get payload
      const { role, username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { graded } = params;
      //#endregion

      //#region Validation
      //#region Validate sheet
      const sheet = await validateSheet(id, this._sheetService, role, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion

      //#endregion

      if (graded) {
        //#region Graded & update class marks
        const result = await generateAdviserMarks(
          request_code,
          role,
          params,
          sheet,
          this._evaluationService,
          this._headerService,
          this._itemService,
          this._levelService,
          this._optionService,
          this._sheetService,
          this._dataSource,
          req,
        );
        //#endregion

        //#region Generate response
        if (result instanceof HttpException) throw result;
        else return result;
        //#endregion
      } else {
        //#region Ungraded
        const result = await generateUngradeSheet(
          request_code,
          role,
          sheet,
          this._sheetService,
          req,
        );
        //#endregion

        //#region Generate response
        if (result instanceof HttpException) throw result;
        else return result;
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
   * @method PUT
   * @url /api/department/multi-approval
   * @access private
   * @description Khoa cập nhật kết quả cho nhiều sinh viên
   * @return HttpResponse<ApproveAllResponse> | HttpException
   * @page sheets page
   */
  @Put('approve-all')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.DEPARTMENT, Role.ADVISER)
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

      //#region Get params jwt
      const { user_id, role } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const {
        all,
        academic_id,
        class_id,
        department_id,
        semester_id,
        except_ids,
      } = params;
      let { include_ids } = params;
      //#endregion

      //#region Validation
      // const valid = await validateOthersDepartment(
      //   role,
      //   department_id,
      //   user_id,
      //   this._otherService,
      //   req,
      // );
      // if (valid instanceof HttpException) throw valid;
      //#endregion

      if (all) {
        const results = await this._sheetService.contains(
          department_id,
          academic_id,
          semester_id,
          role,
          class_id,
        );

        include_ids = results.map((e) => {
          if (e) return e.id;
        });
      }

      // include_ids = include_ids.filter((item) => !except_ids.includes(item));

      const tmp = [];
      for (let i = 0; i < include_ids.length; i++) {
        let flag = false;
        for (let j = 0; j < except_ids.length; j++) {
          if (include_ids[i] == except_ids[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          tmp.push(include_ids[i]);
        }
      }

      include_ids = tmp;

      //#region validate sheet success and not graded
      const count_sheet =
        await this._sheetService.countSheetSuccessAndNotGraded(include_ids);

      if (count_sheet != 0) {
        //#region throw HandlerException
        throw new HandlerException(
          DATABASE_EXIT_CODE.OPERATOR_ERROR,
          req.method,
          req.url,
          ErrorMessage.HAS_SHEET_SUCCESS_OR_NOT_GARDED_ERROR,
          HttpStatus.BAD_REQUEST,
        );
        //#endregion
      }
      //#endregion

      let success = await this._evaluationService.bulkApprove(
        include_ids,
        role,
      );
      if (success) {
        //#region Insert sheet history
        success = await this._historyService.multipleInsertSheetHistory(
          include_ids,
          user_id,
          role,
        );
        //#endregion

        //#region Generate response
        return generateApproveAllResponse(include_ids, success);
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
      console.log('error: ', err);

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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  @Roles(Role.ADMIN, Role.DEPARTMENT)
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

      //#region Get payload
      const { role, username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { graded } = params;
      //#endregion

      //#region Validation
      //#region Validate sheet
      const sheet = await validateSheet(id, this._sheetService, role, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion

      //#endregion

      if (graded) {
        //#region Graded & update department marks
        const result = await generateDepartmentMarks(
          request_code,
          role,
          params,
          sheet,
          this._evaluationService,
          this._headerService,
          this._itemService,
          this._levelService,
          this._optionService,
          this._sheetService,
          this._dataSource,
          req,
        );
        //#endregion

        //#region Generate response
        if (result instanceof HttpException) throw result;
        else return result;
        //#endregion
      } else {
        //#region Ungraded
        const result = await generateUngradeSheet(
          request_code,
          role,
          sheet,
          this._sheetService,
          req,
        );
        //#endregion

        //#region Generate response
        if (result instanceof HttpException) throw result;
        else return result;
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
   * @url api/sheets/weak/:id
   * @access private
   * @descript Cán bộ lớp và khoa đánh giá sinh viên xếp loại kém
   * @return id
   * @page sheets page
   */
  @Put('weak/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  @Roles(
    Role.CHAIRMAN,
    Role.SECRETARY,
    Role.MONITOR,
    Role.ADVISER,
    Role.DEPARTMENT,
    Role.ADMIN,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateWeakMark(@Param('id') id: number, @Req() req: Request) {
    const query_runner = this._dataSource.createQueryRunner();
    await query_runner.connect();

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

      // Start transaction
      await query_runner.startTransaction();

      //#region Get payload
      const { role, username: request_code } = req.user as JwtPayload;
      //#endregion

      //#region validate sheet
      let sheet = await this._sheetService.getSheetById(id);

      if (sheet.graded == 0) {
        throw new HandlerException(
          VALIDATION_EXIT_CODE.NO_MATCHING,
          req.method,
          req.url,
          ErrorMessage.SHEET_NOT_GRADED_ERROR,
        );
      } else if (sheet) {
        //#region get level weak
        const level = await this._levelService.getLevelBySortOrder(
          SheetLevel.WEAK,
        );
        if (level) {
          sheet.updated_at = new Date();
          sheet.updated_by = request_code;
          sheet.graded = 1;
          if (role === Role.ADVISER) {
            sheet.sum_of_adviser_marks = 0;
            sheet.level =
              sheet.status > SheetStatus.WAITING_DEPARTMENT
                ? sheet.level
                : level;
            sheet.status =
              sheet.status > SheetStatus.WAITING_DEPARTMENT
                ? sheet.status
                : SheetStatus.WAITING_DEPARTMENT;
          } else if (role === Role.DEPARTMENT || role === Role.ADMIN) {
            sheet.sum_of_department_marks = 0;
            sheet.level = level;
            sheet.status = SheetStatus.SUCCESS;
          } else {
            sheet.sum_of_class_marks = 0;
            sheet.level =
              sheet.status > SheetStatus.WAITING_ADVISER ? sheet.level : level;
            sheet.status =
              sheet.status > SheetStatus.WAITING_ADVISER
                ? sheet.status
                : SheetStatus.WAITING_ADVISER;
          }
          sheet = await this._sheetService.update(sheet, query_runner.manager);

          const { user_id } = req.user as JwtPayload;

          await this._sheetService.insertHistory(
            sheet.id,
            generateCategoryByRole(role) ?? 1,
            user_id,
            role,
            query_runner.manager,
          );

          await query_runner.commitTransaction();

          return returnObjects({ id: sheet.id });
        } else {
          throw generateFailedResponse(req);
        }
        //#endregion
      } else {
        throw new UnknownException(
          id,
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          ErrorMessage.SHEET_NOT_FOUND_ERROR,
          HttpStatus.OK,
        );
      }
      //#endregion
    } catch (err) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + err.message);
      // Rollback transaction
      await query_runner.rollbackTransaction();

      if (err instanceof HttpException) throw err;
      else {
        throw new HandlerException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
        );
      }
    } finally {
      // Release transaction
      await query_runner.release();
    }
  }
}
