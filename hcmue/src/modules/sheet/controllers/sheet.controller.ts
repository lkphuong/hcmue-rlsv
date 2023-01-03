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
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import {
  generateAdviserMarks,
  generateClassMarks,
  generateDepartmentMarks,
  generatePersonalMarks,
  generateUngradeSheet,
} from '../funcs';

import {
  generateApproveAllResponse,
  generateClassesResponse,
  generateEvaluationsResponse,
  generateItemsResponse,
  generateObjectIdFromUsers,
  generateResponses,
  generateSheet,
  generateUserSheetsResponse,
} from '../utils';

import {
  validateClass,
  validateDepartment,
  validateDepartmentId,
  validateOthersDepartment,
  validateOthersRole,
  validateSheet,
  validateSheetId,
  validateStudentRole,
  validateUserId,
} from '../validations';

import { UserEntity } from '../../../entities/user.entity';

import { ApproveAllDto } from '../dtos/approve_all.dto';

import { GetClassDto } from '../dtos/get_class.dto';
import { GetDetailTitleDto } from '../dtos/get_detail_item.dto';
import { GetSheetsByClassDto } from '../dtos/get_sheets_by_class.dto';

import { UpdateAdviserMarkDto } from '../dtos/update_adviser_mark.dto';
import { UpdateClassMarkDto } from '../dtos/update_class_mark.dto';
import { UpdateDepartmentMarkDto } from '../dtos/update_department_mark.dto';
import { UpdateStudentMarkDto } from '../dtos/update_student_mark.dto';
import { GetSheetsByAdminDto } from '../dtos/get_sheets_admin.dto';

import { ClassService } from '../../class/services/class.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { DepartmentService } from '../../department/services/department.service';
import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { FilesService } from '../../file/services/files.service';
import { HeaderService } from '../../header/services/header.service';
import { ItemService } from '../../item/services/item.service';
import { KService } from '../../k/services/k.service';
import { LogService } from '../../log/services/log.service';
import { LevelService } from '../../level/services/level.service';
import { OptionService } from '../../option/services/option.service';
import { SheetService } from '../services/sheet.service';
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
} from '../interfaces/sheet_response.interface';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import { SheetStatus } from '../constants/enums/status.enum';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';

@Controller('sheets')
export class SheetController {
  constructor(
    private readonly _classService: ClassService,
    private readonly _departmentService: DepartmentService,
    private readonly _evaluationService: EvaluationService,
    private readonly _fileService: FilesService,
    private readonly _headerService: HeaderService,
    private readonly _itemService: ItemService,
    private readonly _kService: KService,
    private readonly _levelService: LevelService,
    private readonly _optionService: OptionService,
    private readonly _sheetService: SheetService,
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
        return await generateSheet(sheet, req);
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
      const evaluations = await this._evaluationService.getEvaluationBySheetId(
        id,
      );
      //#endregion

      if (evaluations && evaluations.length > 0) {
        const base_url = this._configurationService.get(
          Configuration.BASE_URL,
        ) as string;
        //#region Generate response
        return await generateEvaluationsResponse(
          role,
          evaluations,
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
   * @url /api/sheets/admin/
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
  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByAdmin(
    @Body() params: GetSheetsByAdminDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ClassSheetsResponse> | HttpException> {
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
      let user_ids: number[] = null;

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
      if (pages === 0) {
        //#region Count
        const count = await this._sheetService.countSheets(
          academic_id,
          class_id,
          department_id,
          semester_id,
          status,
          null,
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
        null,
        user_ids,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        //#region Generate reponse
        return generateResponses(pages, page, sheets, req);
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
  )
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getSheetsByClass(
    @Param('class_id') class_id: number,
    @Body() params: GetSheetsByClassDto,
    @Req() req: Request,
  ): Promise<HttpPagingResponse<ClassSheetsResponse> | HttpException> {
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
      const { academic_id, department_id, input, page, semester_id } = params;

      let { pages } = params;
      let users: UserEntity[] = null;
      let user_ids: number[] = null;

      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion

      //#region Get Jwt Payload
      const { role, username: request_code } = req.user as JwtPayload;
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

      //#region Validate role
      const valid = validateOthersRole(
        role,
        class_id,
        department_id,
        request_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
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
      if (pages === 0) {
        //#region Count
        const count = await this._sheetService.countSheets(
          academic_id,
          class_id,
          department_id,
          semester_id,
          SheetStatus.ALL,
          role,
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
        SheetStatus.ALL,
        role,
        user_ids,
      );
      //#endregion

      if (sheets && sheets.length > 0) {
        //#region Generate reponse
        return generateResponses(pages, page, sheets, req);
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
      const { class_id } = params;
      //#endregion

      //#region Get classess
      const $class = await this._classService.getClassesByDepartmentId(
        department_id,
        class_id,
      );
      //#endregion

      if ($class && $class.length > 0) {
        //#region Generate response
        return await generateClassesResponse($class, req);
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
  @Roles(Role.STUDENT, Role.MONITOR, Role.CHAIRMAN, Role.SECRETARY)
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

      //#region Get payload
      const { role, username } = req.user as JwtPayload;
      //#endregion

      //#region Validation
      //#region Validate sheet
      const sheet = await validateSheet(id, this._sheetService, req);
      if (sheet instanceof HttpException) throw sheet;
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
  @Roles(Role.MONITOR, Role.SECRETARY, Role.CHAIRMAN)
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
      const sheet = await validateSheet(id, this._sheetService, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion

      //#region Validate role
      const valid = await validateOthersRole(
        role,
        sheet.class_id,
        sheet.department_id,
        request_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
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
  @Roles(Role.MONITOR, Role.SECRETARY, Role.CHAIRMAN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMarkAdviser(
    @Param('id') id: number,
    @Body() params: UpdateAdviserMarkDto,
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
      const sheet = await validateSheet(id, this._sheetService, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion

      //#region Validate role
      const valid = await validateOthersRole(
        role,
        sheet.class_id,
        sheet.department_id,
        request_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
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
      const { all, academic_id, class_id, department_id, semester_id } = params;
      let { include_ids } = params;
      //#endregion

      //#region Validation
      const valid = await validateOthersDepartment(
        role,
        department_id,
        user_id,
        this._userService,
        req,
      );
      if (valid instanceof HttpException) throw valid;
      //#endregion

      if (all) {
        include_ids = await this._sheetService.contains(
          department_id,
          academic_id,
          semester_id,
          class_id,
        );
      }
      const success = await this._evaluationService.bulkApprove(include_ids);
      if (success) {
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
      const sheet = await validateSheet(id, this._sheetService, req);
      if (sheet instanceof HttpException) throw sheet;
      //#endregion

      //#region Validate role
      const valid = await validateOthersRole(
        role,
        sheet.class_id,
        sheet.department_id,
        request_code,
        this._userService,
        req,
      );

      if (valid instanceof HttpException) throw valid;
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
}
