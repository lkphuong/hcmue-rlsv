// import {
//   Controller,
//   Post,
//   Get,
//   Put,
//   HttpException,
//   HttpStatus,
//   Req,
//   UsePipes,
//   ValidationPipe,
//   Body,
//   Param,
//   HttpCode,
// } from '@nestjs/common';

// import { DataSource } from 'typeorm';

// import { Request } from 'express';

// import {
//   generateChildren2ArrayResponse,
//   generateDetailSheet,
//   generateMultiApproveSuccessResponse,
//   generateResponseSheetClass,
//   generateResponseSheetUser,
// } from '../utils';

// import {
//   updateEvaluationClass,
//   updateEvaluationDepartment,
//   updateEvaluationPersonal,
// } from '../funcs';

// import { generateAcademicYearClass2Array } from '../transform';

// import { LogService } from '../../log/services/log.service';
// import { SheetService } from '../services/sheet.service';
// import { UserService } from '../../user/services/user.service';
// import { ApprovalService } from '../../approval/services/approval.service';
// import { AcademicYearService } from '../../academic-year/services/academic_year.service';
// import { ClassService } from '../../class/services/class.service';
// import { DepartmentService } from '../../department/services/department.service';
// import { KService } from '../../k/services/k.service';
// import { EvaluationService } from '../../evaluation/services/evaluation.service';
// import { FormService } from '../../form/services/form.service';
// import { LevelService } from '../../level/services/level.service';

// import { UpdateMarkStudent } from '../dtos/update_mark_student.dto';
// import { UpdateMarkClass } from '../dtos/update_mark_class.dto';
// import { UpdateMarkDepartment } from '../dtos/update_mark_department.dto';
// import { GetSheetByClass } from '../dtos/get_sheet_by_class.dto';
// import { GetClassDto } from '../dtos/get_class.dto';
// import { MultiApproveDto } from '../dtos/multi_approve.dto';
// import { GetChildrenEvaluationDto } from '../dtos/get_children.dto';

// import {
//   ClassResponse,
//   SheetClassResponse,
//   SheetDetailResponse,
//   SheetUsersResponse,
//   MultiApproveResponse,
//   SheetEvaluationResponse,
//   EvaluationResponse,
// } from '../interfaces/sheet_response.interface';
// import { HttpResponse } from '../../../interfaces/http-response.interface';
// import { JwtPayload } from '../../auth/interfaces/payloads/jwt-payload.interface';

// import { HandlerException } from '../../../exceptions/HandlerException';

// import { validateDepartmentId, validateId, validateRole } from '../validations';

// import { Levels } from '../../../constants/enums/level.enum';

// import { ErrorMessage } from '../constants/errors.enum';

// import {
//   DATABASE_EXIT_CODE,
//   SERVER_EXIT_CODE,
// } from '../../../constants/enums/error-code.enum';

// @Controller('sheets')
// export class SheetController {
//   constructor(
//     private readonly _sheetService: SheetService,
//     private readonly _userService: UserService,
//     private readonly _academicYearService: AcademicYearService,
//     private readonly _approvalService: ApprovalService,
//     private readonly _classService: ClassService,
//     private readonly _departmentService: DepartmentService,
//     private readonly _kService: KService,
//     private readonly _evaluationService: EvaluationService,
//     private readonly _levelService: LevelService,
//     private readonly _formService: FormService,
//     private readonly _dataSource: DataSource,
//     private readonly _logger: LogService,
//   ) {
//     // Due to transient scope, SheetController has its own unique instance of LogService,
//     // so setting context here will not affect other instances in other services
//     this._logger.setContext(SheetController.name);
//   }

//   /**
//    * @method GET
//    * @url /api/sheets/:id
//    * @access private
//    * @description Get chi tiết phiếu
//    * @return HttpResponse<SheetEvaluationResponse> | HttpException
//    * @page sheets
//    */
//   @Get(':id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async getSheetById(
//     @Param('id') id: number,
//     @Req() req: Request,
//   ): Promise<HttpResponse<SheetEvaluationResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(
//         req.method + ' - ' + req.url + ': ' + JSON.stringify({ sheet_id: id }),
//       );

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify({ sheet_id: id }),
//       );

//       //#region Get sheet
//       const sheet = await this._sheetService.getSheetById(id);
//       //#endregion

//       let result: HttpResponse<SheetEvaluationResponse> = null;
//       if (sheet) {
//         const evaluations =
//           await this._evaluationService.getEvaluationBySheetId(id);

//         if (evaluations && evaluations.length > 0) {
//           result = await generateDetailSheet(
//             sheet,
//             null,
//             evaluations,
//             this._evaluationService,
//             this._formService,
//             req,
//           );

//           return result;
//         } else {
//           const form = await this._formService.getForm();
//           result = await generateDetailSheet(
//             sheet,
//             form,
//             null,
//             this._evaluationService,
//             this._formService,
//             req,
//           );

//           return result;
//         }
//       } else {
//         //#region throw HandlerException
//         throw new HandlerException(
//           DATABASE_EXIT_CODE.NO_CONTENT,
//           req.method,
//           req.url,
//           ErrorMessage.NO_CONTENT,
//           HttpStatus.NOT_FOUND,
//         );
//         //#endregion
//       }
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method GET
//    * @url /api/sheets/student/:user_id
//    * @access private
//    * @description Get danh sách phiếu đánh giá cá nhân
//    * @return  HttpResponse<SheetUsersResponse> | HttpException
//    */
//   @Get('student/:user_id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async getSheetsByUser(
//     @Param('user_id') user_id: string,
//     @Req() req: Request,
//   ): Promise<HttpResponse<SheetUsersResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(
//         req.method +
//           ' - ' +
//           req.url +
//           ': ' +
//           JSON.stringify({ user_id: user_id }),
//       );

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify({ user_id: user_id }),
//       );

//       //#region Get sheets
//       const sheets = await this._sheetService.getSheetsByUserId(user_id);
//       //#endregion

//       if (sheets && sheets.length > 0) {
//         return generateResponseSheetUser(sheets, req);
//       } else {
//         //#region throw HandlerException
//         throw new HandlerException(
//           DATABASE_EXIT_CODE.NO_CONTENT,
//           req.method,
//           req.url,
//           ErrorMessage.NO_CONTENT,
//           HttpStatus.NOT_FOUND,
//         );
//         //#endregion
//       }
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method Get
//    * @url api/sheets/:id/evaluation/:parent_id
//    * @access private
//    * @description Get danh sách children evaluation
//    * @return
//    * @page sheets
//    */
//   @Get(':id/evaluation/:parent_id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async getChildrenEvaluation(
//     @Param() params: GetChildrenEvaluationDto,
//     @Req() req: Request,
//   ): Promise<HttpResponse<EvaluationResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(
//         req.method +
//           ' - ' +
//           req.url +
//           ': ' +
//           JSON.stringify({ params: params }),
//       );

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify({ params: params }),
//       );

//       //#region Get params
//       const { id, parent_id } = params;
//       //#endregion

//       //#region Get children
//       const children = await this._formService.getChildren(id, parent_id);

//       if (children && children.length > 0) {
//         const result = await generateChildren2ArrayResponse(
//           children,
//           this._formService,
//           req,
//         );

//         return result;
//       } else {
//         //#region throw HandlerException
//         throw new HandlerException(
//           DATABASE_EXIT_CODE.NO_CONTENT,
//           req.method,
//           req.url,
//           ErrorMessage.NO_CONTENT,
//           HttpStatus.NOT_FOUND,
//         );
//         //#endregion
//       }
//       //#endregion
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method Post
//    * @url /api/sheets/student/:user_id
//    * @access private
//    * @description Get danh sách phiếu đánh giá cá nhân
//    * @return  HttpResponse<SheetClassResponse> | HttpException
//    */
//   @Post('class/:class_id')
//   @HttpCode(HttpStatus.OK)
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async getSheetByClas(
//     @Param('class_id') class_id: string,
//     @Body() params: GetSheetByClass,
//     @Req() req: Request,
//   ): Promise<HttpResponse<SheetClassResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(
//         req.method +
//           ' - ' +
//           req.url +
//           ': ' +
//           JSON.stringify({ class_id: class_id, params: params }),
//       );

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify({ class_id: class_id, params: params }),
//       );

//       //#region Get params
//       const { academic_id, semester_id } = params;
//       const input = params.input ?? null;

//       //#region Get sheets
//       const sheets = await this._sheetService.getSheetPaging(
//         semester_id,
//         academic_id,
//       );
//       //#endregion

//       if (sheets && sheets.length > 0) {
//         return await generateResponseSheetClass(
//           input,
//           sheets,
//           this._userService,
//           req,
//         );
//       } else {
//         //#region throw HandlerException
//         throw new HandlerException(
//           DATABASE_EXIT_CODE.NO_CONTENT,
//           req.method,
//           req.url,
//           ErrorMessage.NO_CONTENT,
//           HttpStatus.NOT_FOUND,
//         );
//         //#endregion
//       }
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method POST
//    * @url /api/department/:department_id
//    * @access private
//    * @description danh sách lớp theo khoa
//    * @return HttpResponse<Class[]> | null | HttpException
//    * @page
//    */
//   @Post('department/:department_id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async getClassesByDepartment(
//     @Param('department_id') department_id: string,
//     @Body() params: GetClassDto,
//     @Req() req: Request,
//   ): Promise<HttpResponse<ClassResponse[]> | null | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify(params),
//       );
//       //#region Validation department_id
//       const vali = validateDepartmentId(department_id, req);
//       if (vali instanceof HttpException) throw vali;

//       //#endregion

//       //#region Get params
//       const { academic_id } = params;
//       const class_id = params.class_id ?? null;
//       //#endregion

//       const academic_year =
//         await this._academicYearService.getAcademicYearClassesById(academic_id);

//       console.log(academic_year);
//       if (academic_year) {
//         if (
//           academic_year.academic_year_classes &&
//           academic_year.academic_year_classes.length > 0
//         ) {
//           const classes = await generateAcademicYearClass2Array(
//             department_id,
//             class_id,
//             academic_year,
//             this._classService,
//           );

//           if (classes && classes.length > 0) {
//             return {
//               data: classes,
//               errorCode: 0,
//               message: null,
//               errors: null,
//             };
//           }
//         }
//       }
//       //#region throw HandlerException
//       throw new HandlerException(
//         DATABASE_EXIT_CODE.NO_CONTENT,
//         req.method,
//         req.url,
//         ErrorMessage.NO_CONTENT,
//         HttpStatus.NOT_FOUND,
//       );
//       //#endregion
//     } catch (err) {
//       console.log(err);
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method PUT
//    * @url /api/student/:id
//    * @access private
//    * @description Sinh viên cập nhật kết quả phiếu rèn luyện
//    * @return HttpResponse<SheetDetailResponse> | HttpException
//    * @page
//    */
//   @Put('student/:id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async updateMartStudent(
//     @Param('id') id: number,
//     @Body() params: UpdateMarkStudent,
//     @Req() req: Request,
//   ): Promise<HttpResponse<SheetDetailResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify(params),
//       );

//       //#region Validation
//       const vali = validateId(id, req);
//       if (vali instanceof HttpException) throw vali;
//       //#endregion

//       const { role, user_id } = req.user as JwtPayload;

//       //#region Create or update sheet
//       const sheet = await updateEvaluationPersonal(
//         id,
//         role,
//         user_id,
//         params,
//         this._approvalService,
//         this._sheetService,
//         this._evaluationService,
//         this._formService,
//         this._levelService,
//         this._departmentService,
//         this._classService,
//         this._kService,
//         this._userService,
//         this._dataSource,
//         req,
//       );
//       //#endregion

//       if (sheet instanceof HttpException) throw sheet;
//       else return sheet;
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method PUT
//    * @url /api/class/:id
//    * @access private
//    * @description Lớp cập nhật kết quả phiếu rèn luyện
//    * @return HttpResponse<SheetDetailResponse> | HttpException
//    * @page
//    */
//   @Put('class/:id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async updateMartClass(
//     @Param('id') id: number,
//     @Body() params: UpdateMarkClass,
//     @Req() req: Request,
//   ): Promise<HttpResponse<SheetDetailResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify(params),
//       );

//       //#region Validation
//       const vali = validateId(id, req);
//       if (vali instanceof HttpException) throw vali;
//       //#endregion

//       const { role, user_id } = req.user as JwtPayload;

//       //#region Create or update sheet
//       const sheet = await updateEvaluationClass(
//         id,
//         role,
//         user_id,
//         params,
//         this._approvalService,
//         this._sheetService,
//         this._evaluationService,
//         this._formService,
//         this._levelService,
//         this._departmentService,
//         this._classService,
//         this._kService,
//         this._userService,
//         this._dataSource,
//         req,
//       );
//       //#endregion

//       if (sheet instanceof HttpException) throw sheet;
//       else return sheet;
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method PUT
//    * @url /api/department/approval
//    * @access private
//    * @description Khoa cập nhật kết quả cho nhiều sinh viên
//    * @return HttpResponse<MultiApproveResponse> | HttpException
//    * @page sheets
//    */
//   @Put('department/multi-approval')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async multiApprove(
//     @Body() params: MultiApproveDto,
//     @Req() req: Request,
//   ): Promise<HttpResponse<MultiApproveResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify(params),
//       );

//       //#region Get params
//       const { role_id, sheet_ids } = params;
//       //#endregion

//       const { role } = req.user as JwtPayload;
//       //#region  Validate role
//       const valid = await validateRole(role_id, role, req);
//       if (valid instanceof HttpException) throw valid;
//       //#endregion

//       const success = await this._evaluationService.multiApprove(sheet_ids);
//       if (success) {
//         return generateMultiApproveSuccessResponse(sheet_ids, success);
//       } else {
//         //#region throw HandlerException
//         throw new HandlerException(
//           DATABASE_EXIT_CODE.OPERATOR_ERROR,
//           req.method,
//           req.url,
//           ErrorMessage.OPERATOR_MULTI_APPROVAL_ERROR,
//           HttpStatus.EXPECTATION_FAILED,
//         );
//         //#endregion
//       }
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }

//   /**
//    * @method PUT
//    * @url /api/class/:id
//    * @access private
//    * @description Khoa cập nhật kết quả phiếu rèn luyện
//    * @return HttpResponse<SheetDetailResponse> | HttpException
//    * @page sheets
//    */
//   @Put('department/:id')
//   @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
//   async updateMartDepartment(
//     @Param('id') id: number,
//     @Body() params: UpdateMarkDepartment,
//     @Req() req: Request,
//   ): Promise<HttpResponse<SheetDetailResponse> | HttpException> {
//     try {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

//       this._logger.writeLog(
//         Levels.LOG,
//         req.method,
//         req.url,
//         JSON.stringify(params),
//       );

//       //#region Validation
//       const vali = validateId(id, req);
//       if (vali instanceof HttpException) throw vali;
//       //#endregion

//       const { role, user_id } = req.user as JwtPayload;

//       //#region Create or update sheet
//       const sheet = await updateEvaluationDepartment(
//         id,
//         role,
//         user_id,
//         params,
//         this._approvalService,
//         this._sheetService,
//         this._evaluationService,
//         this._formService,
//         this._levelService,
//         this._departmentService,
//         this._classService,
//         this._kService,
//         this._userService,
//         this._dataSource,
//         req,
//       );
//       //#endregion

//       if (sheet instanceof HttpException) throw sheet;
//       else return sheet;
//     } catch (err) {
//       console.log('----------------------------------------------------------');
//       console.log(req.method + ' - ' + req.url + ': ' + err.message);

//       if (err instanceof HttpException) throw err;
//       else {
//         throw new HandlerException(
//           SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
//           req.method,
//           req.url,
//         );
//       }
//     }
//   }
// }
