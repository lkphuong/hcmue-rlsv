import {
  Controller,
  Post,
  Get,
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
  generateEvaluationsArray,
  generateEvaluationsResponse,
  generateSheet,
  generateSheetPagination,
  getDifferentObjects,
} from '../utils';

import { LogService } from '../../log/services/log.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { HistoryService } from '../services/history.service';

import { UserService } from '../../user/services/user.service';
import { AdviserService } from '../../adviser/services/adviser/adviser.service';
import { OtherService } from '../../other/services/other.service';

import { validateSheetId } from '../validations';

import { UserEntity } from '../../../entities/user.entity';
import { AdviserEntity } from '../../../entities/adviser.entity';
import { OtherEntity } from '../../../entities/other.entity';

import { Roles } from '../../auth/decorators/roles.decorator';
import { GetHistoryDto } from '../dtos/get_history.dto';

import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';
import {
  EvaluationsResponse,
  SheetDetailsResponse,
} from '../../sheet/interfaces/sheet_response.interface';
import { HttpResponse } from '../../../interfaces/http-response.interface';

import { HandlerException } from '../../../exceptions/HandlerException';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { Role } from '../../auth/constants/enums/role.enum';
import { Configuration } from '../../shared/constants/configuration.enum';
import { ErrorMessage } from '../../sheet/constants/enums/errors.enum';

@Controller('history')
export class HistoryController {
  constructor(
    private readonly _logger: LogService,
    private readonly _configurationService: ConfigurationService,
    private readonly _historyService: HistoryService,
    private readonly _userService: UserService,
    private readonly _adviserService: AdviserService,
    private readonly _otherService: OtherService,
  ) {}

  /**
   * @method POST
   * @url /api/history/all
   * @access private
   * @param sheet_id
   * @param pages
   * @param page
   * @description Hiển thị danh sách tình trạng biểu mẫu cho khoa
   * @return HttpPagingResponse<ClassResponse> | HttpException
   * @page sheets page
   */
  @Post('all')
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getClassStatusDepartment(
    @Body() params: GetHistoryDto,
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
      const { sheet_id, page } = params;
      let { pages } = params;
      const itemsPerPage = parseInt(
        this._configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      //#endregion
      //#region Get pages
      let count = 0;
      if (pages === 0) {
        //#region Count
        count = await this._historyService.count(sheet_id);

        if (count > 0) pages = Math.ceil(count / itemsPerPage);
        //#endregion
      }
      //#endregion

      //#region get sheet history
      const sheets = await this._historyService.getSheetHistory(
        (page - 1) * itemsPerPage,
        itemsPerPage,
        sheet_id,
      );
      //#endregion

      if (sheets) {
        const student_ids = sheets
          .filter((e) =>
            [
              Role.STUDENT,
              Role.CHAIRMAN,
              Role.MONITOR,
              Role.SECRETARY,
            ].includes(e.role),
          )
          .map((_e) => Number(_e.created_by));

        const adviser_ids = sheets
          .filter((e) => e.role === Role.ADVISER)
          .map((_e) => Number(_e.created_by));

        const other_ids = sheets
          .filter((e) => [Role.DEPARTMENT, Role.ADMIN].includes(e.role))
          .map((_e) => Number(_e.created_by));

        let students: UserEntity[] = [];
        let advisers: AdviserEntity[] = [];
        let others: OtherEntity[] = [];

        if (student_ids?.length) {
          students = await this._userService.getUserByIds(student_ids);
        }

        if (adviser_ids?.length) {
          advisers = await this._adviserService.getAdviserByIds(adviser_ids);
        }

        if (other_ids?.length) {
          others = await this._otherService.getOtherByIds(other_ids);
        }

        return generateSheetPagination(
          pages,
          page,
          sheets,
          students,
          advisers,
          others,
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
   * @method GET
   * @url /api/history/:id
   * @access private
   * @param id
   * @description Get chi tiết lịch sử phiếu
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

      const { role } = req.user as JwtPayload;

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;

      //#endregion

      //#region Get sheet
      const sheet = await this._historyService.getSheetById(id);
      //#endregion
      if (sheet) {
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

      //#region Validation
      const valid = validateSheetId(id, req);
      if (valid instanceof HttpException) throw valid;
      //#endregion

      const sheet = await this._historyService.getById(id);

      if (sheet) {
        const evaluations = await this._historyService.getEvaluationBySheetId(
          sheet.id,
          sheet.role,
        );
        if (sheet.sort_order > 1) {
          const previous_sheet = await this._historyService.getPreviousSheet(
            sheet.sheet_id,
            sheet.sort_order - 1,
          );

          if (previous_sheet) {
            const previous_evaluations =
              await this._historyService.getEvaluationBySheetId(
                previous_sheet.id,
                previous_sheet.role,
              );

            const current_evaluation = await generateEvaluationsArray(
              evaluations,
            );

            const previous_evaluation = await generateEvaluationsArray(
              previous_evaluations,
            );

            const different_evaluation = getDifferentObjects(
              current_evaluation,
              previous_evaluation,
            );

            if (evaluations && evaluations.length > 0) {
              //#region Generate response
              return await generateEvaluationsResponse(
                evaluations,
                different_evaluation,
                req,
              );
              //#endregion
            }
          }
        }

        if (evaluations && evaluations.length > 0) {
          //#region Generate response
          return await generateEvaluationsResponse(evaluations, null, req);
          //#endregion
        }
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
}
