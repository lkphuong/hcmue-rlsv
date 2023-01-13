import {
  Controller,
  Body,
  Req,
  HttpException,
  HttpStatus,
  ValidationPipe,
  HttpCode,
  Post,
  Get,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import * as md5 from 'md5';

import { returnObjects, sprintf } from '../../../utils';

import {
  generateAccessToken,
  generateRefreshToken,
  generateResponse,
  generateUpdatePasswordSuccess,
  validatePassword,
} from '../utils';

import { ChangePasswordDto } from '../dtos/change-password.dto';
import { LoginParamsDto } from '../dtos/login-params.dto';
import { RenewalParamsDto } from '../dtos/renewal-params.dto';

import { JwtPayload } from '../interfaces/payloads/jwt-payload.interface';

import { HttpResponse } from '../../../interfaces/http-response.interface';
import { HttpNoneResponse } from '../../../interfaces/http-none-response.interface';

import { LoginResponse } from '../interfaces/login-response.interface';
import { ProfileResponse } from '../interfaces/auth-response.interface';

import { AdviserClassesService } from '../../adviser/services/adviser-classes/adviser_classes.service';
import { AdviserService } from '../../adviser/services/adviser/adviser.service';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';
import { OtherService } from '../../other/services/other.service';
import { UserService } from '../../user/services/user.service';

import { HandlerException } from '../../../exceptions/HandlerException';
import { InvalidTokenException } from '../exceptions/InvalidTokenException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { JwtAuthGuard } from '../guards/jwt.guard';
import { LogoutGuard } from '../guards/logout.guard';

import { validateConfirmPassword } from '../validations';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';

import {
  AUTHENTICATION_EXIT_CODE,
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { LoginType } from '../constants/enums/login_type.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _adviserService: AdviserService,
    private readonly _adviserClassService: AdviserClassesService,
    private readonly _otherService: OtherService,
    private readonly _userService: UserService,
    private readonly _configurationService: ConfigurationService,
    private readonly _jwtService: JwtService,
    private _logger: LogService,
  ) {
    // Due to transient scope, AuthController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(AuthController.name);
  }

  /**
   * @method POST
   * @url /api/auth/logion
   * @param username
   * @param password
   * @return HttpResponse<LoginResponse> | HttpException
   * @description Validate the account
   * @page Login page
   */
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(
    @Body() params: LoginParamsDto,
    @Req() req: Request,
  ): Promise<HttpResponse<LoginResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region get params
      const { password, username, type } = params;
      //#endregion
      switch (type) {
        case LoginType.ADVISER:
          const adviser = await this._adviserService.getAdviserByEmail(
            username,
          );

          if (adviser) {
            const isMatch = await validatePassword(password, adviser.password);

            if (isMatch) {
              //#region get role
              const role_user = await this._authService.getRoleByUserCode(
                adviser.email,
              );
              //#endregion

              //#region Generate access_token
              const access_token = generateAccessToken(
                this._jwtService,
                this._configurationService,
                adviser.id,
                adviser.email,
                role_user?.role?.code ?? 0,
              );
              //#endregion

              //#region Generate refresh_token
              const refresh_token = generateRefreshToken(
                this._jwtService,
                this._configurationService,
                adviser.email,
              );
              //#endregion

              //#region Generate session
              let session = await this._authService.contains(username);

              if (!session) {
                session = await this._authService.add(
                  adviser.id,
                  adviser.email,
                  adviser.fullname,
                  role_user?.role?.code ?? 0,
                  null,
                  adviser.department_id,
                  access_token,
                  refresh_token,
                  new Date(),
                  true,
                );
              } else {
                session = await this._authService.renew(
                  access_token,
                  refresh_token,
                  session,
                );
              }

              console.log('session: ', session);
              //#region Generate response
              return await generateResponse(
                session,
                access_token,
                refresh_token,
                req,
              );
              //#endregion
            } else {
              //#region throw HandlerException
              throw new HandlerException(
                DATABASE_EXIT_CODE.UNKNOW_VALUE,
                req.method,
                req.url,
                ErrorMessage.LOGIN_FAILD,
                HttpStatus.NOT_FOUND,
              );
              //#endregion
            }
          } else {
            //#region throw HandlerException
            throw new HandlerException(
              DATABASE_EXIT_CODE.UNKNOW_VALUE,
              req.method,
              req.url,
              ErrorMessage.LOGIN_FAILD,
              HttpStatus.NOT_FOUND,
            );
            //#endregion
          }
        case LoginType.DEPARTMENT:
        case LoginType.ADMIN:
          const other = await this._otherService.getOtherByUsername(username);
          if (other) {
            const isMatch = await validatePassword(password, other.password);

            if (isMatch) {
              //#region get role
              const role_user = await this._authService.getRoleByUserCode(
                other.id.toString(),
              );
              //#endregion

              //#region Generate access_token
              const access_token = generateAccessToken(
                this._jwtService,
                this._configurationService,
                other.id,
                other.username,
                role_user?.role?.code ?? 0,
              );
              //#endregion

              //#region Generate refresh_token
              const refresh_token = generateRefreshToken(
                this._jwtService,
                this._configurationService,
                other.username,
              );
              //#endregion

              //#region Generate session
              let session = await this._authService.contains(username);
              if (!session) {
                session = await this._authService.add(
                  other.id,
                  other.username,
                  other?.department?.name ?? null,
                  role_user?.role?.code ?? 0,
                  null,
                  other.department_id,
                  access_token,
                  refresh_token,
                  new Date(),
                  true,
                );
              } else {
                session = await this._authService.renew(
                  access_token,
                  refresh_token,
                  session,
                );
              }

              //#region Generate response
              return await generateResponse(
                session,
                access_token,
                refresh_token,
                req,
              );
              //#endregion
            } else {
              //#region throw HandlerException
              throw new HandlerException(
                DATABASE_EXIT_CODE.UNKNOW_VALUE,
                req.method,
                req.url,
                ErrorMessage.LOGIN_FAILD,
                HttpStatus.NOT_FOUND,
              );
              //#endregion
            }
          } else {
            //#region throw HandlerException
            throw new HandlerException(
              DATABASE_EXIT_CODE.UNKNOW_VALUE,
              req.method,
              req.url,
              ErrorMessage.LOGIN_FAILD,
              HttpStatus.NOT_FOUND,
            );
            //#endregion
          }
        default:
          const student = await this._authService.getUserByUsername(username);
          console.log('student: ', student);
          if (student) {
            const isMatch = await validatePassword(password, student.password);

            if (isMatch) {
              //#region get role
              const role_user = await this._authService.getRoleByUserCode(
                student.std_code,
              );

              //#endregion

              //#region Generate access_token
              const access_token = generateAccessToken(
                this._jwtService,
                this._configurationService,
                student.id,
                student.std_code,
                role_user?.role?.code ?? 0,
              );
              //#endregion

              //#region Generate refresh_token
              const refresh_token = generateRefreshToken(
                this._jwtService,
                this._configurationService,
                student.std_code,
              );
              //#endregion

              //#region Generate session
              let session = await this._authService.contains(username);

              if (!session) {
                session = await this._authService.add(
                  student.id,
                  student.std_code,
                  student.fullname,
                  role_user?.role?.code ?? 0,
                  student.class_id,
                  student.department_id,
                  access_token,
                  refresh_token,
                  new Date(),
                  true,
                );
              } else {
                session = await this._authService.renew(
                  access_token,
                  refresh_token,
                  session,
                );
              }

              //#region Generate response
              return await generateResponse(
                session,
                access_token,
                refresh_token,
                req,
              );
              //#endregion
            } else {
              //#region throw HandlerException
              throw new HandlerException(
                DATABASE_EXIT_CODE.UNKNOW_VALUE,
                req.method,
                req.url,
                ErrorMessage.LOGIN_FAILD,
                HttpStatus.NOT_FOUND,
              );
              //#endregion
            }
          } else {
            //#region throw HandlerException
            throw new HandlerException(
              DATABASE_EXIT_CODE.UNKNOW_VALUE,
              req.method,
              req.url,
              ErrorMessage.LOGIN_FAILD,
              HttpStatus.NOT_FOUND,
            );
            //#endregion
          }
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
   * @method POST
   * @url api/auth/change-password
   * @param old_password
   * @param new_password
   * @param confirm_password
   * @returns HttpResponse<> | HttpException
   * @description Change password
   * @page profile page
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() params: ChangePasswordDto, @Req() req: Request) {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      //#region Get Request
      const { username: request_code, role } = req.user as JwtPayload;
      //#endregion

      //#region Get params
      const { confirm_password, new_password, old_password } = params;
      //#endregion

      //#region Validate password
      const valid = validateConfirmPassword(
        new_password,
        confirm_password,
        req,
      );
      if (valid instanceof HttpException) throw valid;

      //#endregion

      switch (role) {
        case RoleCode.ADVISER:
          //#region get table teachers
          let adviser = await this._adviserService.getAdviserByEmail(
            request_code,
          );

          if (adviser) {
            const isMatch = await validatePassword(
              old_password,
              adviser.password,
            );
            if (isMatch) {
              //#region Update new password
              adviser.password = md5(new_password);

              adviser = await this._adviserService.update(adviser);

              if (adviser) {
                return generateUpdatePasswordSuccess(adviser.email, req);
              } else {
                //#region throw HandlerException
                throw new HandlerException(
                  DATABASE_EXIT_CODE.OPERATOR_ERROR,
                  req.method,
                  req.url,
                  ErrorMessage.OPERATOR_PASSWORD_ERROR,
                  HttpStatus.EXPECTATION_FAILED,
                );
                //#endregion
              }
              //#endregion
            } else {
              //#region throw HandlerException
              throw new HandlerException(
                DATABASE_EXIT_CODE.OPERATOR_ERROR,
                req.method,
                req.url,
                ErrorMessage.OLD_PASSWORD_NO_MATCHING_ERROR,
                HttpStatus.BAD_REQUEST,
              );
              //#endregion
            }
          } else {
            //#region throw HandlerException
            throw new UnknownException(
              (req.user as any).user_id,
              VALIDATION_EXIT_CODE.NOT_FOUND,
              req.method,
              req.url,
              sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, request_code),
            );
          }

        //#endregion

        case RoleCode.DEPARTMENT:
        case RoleCode.ADMIN:
          //#region  Get table orther
          let other = await this._otherService.getOtherByUsername(request_code);

          if (other) {
            const isMatch = await validatePassword(
              old_password,
              other.password,
            );
            if (isMatch) {
              //#region Update new password
              other.password = md5(new_password);

              other = await this._otherService.update(other);

              if (other) {
                return generateUpdatePasswordSuccess(other.username, req);
              } else {
                //#region throw HandlerException
                throw new HandlerException(
                  DATABASE_EXIT_CODE.OPERATOR_ERROR,
                  req.method,
                  req.url,
                  ErrorMessage.OPERATOR_PASSWORD_ERROR,
                  HttpStatus.EXPECTATION_FAILED,
                );
                //#endregion
              }
              //#endregion
            } else {
              //#region throw HandlerException
              throw new HandlerException(
                DATABASE_EXIT_CODE.OPERATOR_ERROR,
                req.method,
                req.url,
                ErrorMessage.OLD_PASSWORD_NO_MATCHING_ERROR,
                HttpStatus.BAD_REQUEST,
              );
              //#endregion
            }
          } else {
            //#region throw HandlerException
            throw new UnknownException(
              (req.user as any).user_id,
              VALIDATION_EXIT_CODE.NOT_FOUND,
              req.method,
              req.url,
              sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, request_code),
            );
          }

        //#endregion

        default:
          //#region  Get table orther
          let user = await this._userService.getUserByCode(request_code);
          console.log('old_password: ', old_password);
          console.log('new_password: ', new_password);
          console.log('confirm_password: ', confirm_password);
          if (user) {
            const isMatch = await validatePassword(old_password, user.password);
            console.log(
              md5(old_password),
              user.password,
              md5(old_password) === user.password,
              isMatch,
            );
            if (isMatch) {
              //#region Update new password
              user.password = md5(new_password);

              user = await this._userService.update(user);

              if (user) {
                return generateUpdatePasswordSuccess(user.std_code, req);
              } else {
                //#region throw HandlerException
                throw new HandlerException(
                  DATABASE_EXIT_CODE.OPERATOR_ERROR,
                  req.method,
                  req.url,
                  ErrorMessage.OPERATOR_PASSWORD_ERROR,
                  HttpStatus.EXPECTATION_FAILED,
                );
                //#endregion
              }
              //#endregion
            } else {
              //#region throw HandlerException
              throw new HandlerException(
                DATABASE_EXIT_CODE.OPERATOR_ERROR,
                req.method,
                req.url,
                ErrorMessage.OLD_PASSWORD_NO_MATCHING_ERROR,
                HttpStatus.BAD_REQUEST,
              );
              //#endregion
            }
          } else {
            //#region throw HandlerException
            throw new UnknownException(
              (req.user as any).user_id,
              VALIDATION_EXIT_CODE.NOT_FOUND,
              req.method,
              req.url,
              sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, request_code),
            );
          }
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
   * @url /api/auth/get-profile
   * @access private
   * @param
   * @returns HttpResponse<ProfileResponse> | HttpException
   * @description Get the account profile
   * @page Profile page
   */
  @Get('get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Req() req: Request,
  ): Promise<HttpResponse<ProfileResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      //#region Get Request
      const { username: request_code, role, user_id } = req.user as JwtPayload;
      //#endregion

      switch (role) {
        case RoleCode.ADVISER:
          const adviser_session = await this._adviserService.getAdviserByEmail(
            request_code,
          );

          //#region get class of adviser
          const adviser_classes =
            await this._adviserClassService.getClassByAdviserId(
              adviser_session.id,
            );

          console.log(adviser_classes);
          //#endregion
          if (adviser_session) {
            //#region Generate response
            return returnObjects<ProfileResponse>({
              user_id: adviser_session.id,
              username: adviser_session?.email,
              fullname: adviser_session.fullname ?? null,
              class_id:
                adviser_classes && adviser_classes.length > 0
                  ? adviser_classes.map((item) => {
                      return item.class_id;
                    })
                  : [],
              department_id: adviser_session.department_id ?? null,
              role: role,
            });
            //#endregion
          }
          //#region throw HandlerException
          throw new UnknownException(
            (req.user as any).user_id,
            VALIDATION_EXIT_CODE.NOT_FOUND,
            req.method,
            req.url,
            sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, request_code),
          );
        //#endregion
        case RoleCode.DEPARTMENT:
        case RoleCode.ADMIN:
          const other_session = await this._otherService.getOtherByUsername(
            request_code,
          );
          if (other_session) {
            //#region Generate response
            return returnObjects<ProfileResponse>({
              user_id: other_session.id,
              username: other_session?.username,
              fullname: other_session?.department?.name ?? null,
              class_id: null,
              department_id: other_session.department_id ?? null,
              role: role,
            });
            //#endregion
          }
          //#region throw HandlerException
          throw new UnknownException(
            (req.user as any).user_id,
            VALIDATION_EXIT_CODE.NOT_FOUND,
            req.method,
            req.url,
            sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, request_code),
          );
        //#endregion
        default:
          const session = await this._authService.getProfile(user_id);
          if (session) {
            //#region Generate response
            return returnObjects<ProfileResponse>({
              user_id: session.user_id,
              username: session.username,
              fullname: session.fullname,
              class_id: [session.class],
              department_id: session.department,
              role: role,
            });
            //#endregion
          }

          //#region throw HandlerException
          throw new UnknownException(
            (req.user as any).user_id,
            VALIDATION_EXIT_CODE.NOT_FOUND,
            req.method,
            req.url,
            sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, request_code),
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
   * @url /api/auth/renew-token
   * @access public
   * @param refresh_token
   * @returns HttpResponse<LoginResponse> | HttpException
   * @description Renew the access_token
   * @page Any page
   */
  @Post('/renew-token')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async renewal(
    @Body() params: RenewalParamsDto,
    @Req() req: Request,
  ): Promise<HttpResponse<LoginResponse> | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + JSON.stringify(params));

      this._logger.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(params),
      );

      const { refresh_token } = params;

      //#region Session
      let session = await this._authService.isValid(refresh_token);
      if (session) {
        //#region Decode token
        const decoded = this._jwtService.verify(refresh_token, {
          secret: this._configurationService.get(
            Configuration.REFRESH_SECRET_KEY,
          ),
        });
        //#endregion

        // Check refresh_token whether is expired?
        if (Date.now() >= decoded.exp * 1000) {
          //#region Token expired
          //#region Session
          //#region Cancel session
          await this._authService.update(new Date(), null, session);
          //#endregion
          //#endregion

          //#region throw HandlerException
          throw new UnauthorizedException(
            refresh_token,
            AUTHENTICATION_EXIT_CODE.EXPIRED_TOKEN,
            req.method,
            req.url,
          );
          //#endregion
          //#endregion
        } else {
          switch (session.role_id) {
            case RoleCode.ADVISER:
              //#region Get info adviser
              const adviser = await this._adviserService.getAdviserByEmail(
                session.username,
              );
              if (adviser) {
                //#region get role
                const role_adviser = await this._authService.getRoleByUserCode(
                  adviser.email,
                );
                //#endregion
                //#region Generate access_token
                const renew_access_token = generateAccessToken(
                  this._jwtService,
                  this._configurationService,
                  adviser.id,
                  adviser.email,
                  role_adviser?.role?.id ?? 0,
                );
                //#endregion

                //#region Generate refresh_token
                const renew_refresh_token = generateRefreshToken(
                  this._jwtService,
                  this._configurationService,
                  adviser.email,
                );
                //#endregion

                //#region Update session with new tokens
                session = await this._authService.renew(
                  renew_access_token,
                  renew_refresh_token,
                  session,
                );
                //#endregion

                return await generateResponse(
                  session,
                  renew_access_token,
                  renew_refresh_token,
                  req,
                );
              } else {
                //#region Token not found
                throw new InvalidTokenException(
                  refresh_token,
                  AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
                  req.method,
                  req.url,
                );
                //#endregion
              }
            //#endregion
            case RoleCode.DEPARTMENT:
            case RoleCode.ADMIN:
              //#region Get info department or admin by code
              const other = await this._otherService.getOtherByUsername(
                session.username,
              );
              if (other) {
                //#region get role
                const role_other = await this._authService.getRoleByUserCode(
                  other.id.toString(),
                );
                //#endregion
                //#region Generate access_token
                const renew_access_token = generateAccessToken(
                  this._jwtService,
                  this._configurationService,
                  other.id,
                  other.username,
                  role_other?.role?.id ?? 0,
                );
                //#endregion

                //#region Generate refresh_token
                const renew_refresh_token = generateRefreshToken(
                  this._jwtService,
                  this._configurationService,
                  other.username,
                );
                //#endregion

                //#region Update session with new tokens
                session = await this._authService.renew(
                  renew_access_token,
                  renew_refresh_token,
                  session,
                );
                //#endregion

                return await generateResponse(
                  session,
                  renew_access_token,
                  renew_refresh_token,
                  req,
                );
              } else {
                //#region Token not found
                throw new InvalidTokenException(
                  refresh_token,
                  AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
                  req.method,
                  req.url,
                );
                //#endregion
              }
            //#endregion
            default:
              //#region Get info user by code
              const user = await this._authService.getUserByUsername(
                session.username,
              );
              if (user) {
                //#region get role
                const role_user = await this._authService.getRoleByUserCode(
                  user.std_code,
                );
                //#endregion
                //#region Generate access_token
                const renew_access_token = generateAccessToken(
                  this._jwtService,
                  this._configurationService,
                  user.id,
                  user.std_code,
                  role_user?.role?.id ?? 0,
                );
                //#endregion

                //#region Generate refresh_token
                const renew_refresh_token = generateRefreshToken(
                  this._jwtService,
                  this._configurationService,
                  user.std_code,
                );
                //#endregion

                //#region Update session with new tokens
                session = await this._authService.renew(
                  renew_access_token,
                  renew_refresh_token,
                  session,
                );
                //#endregion

                return await generateResponse(
                  session,
                  renew_access_token,
                  renew_refresh_token,
                  req,
                );
              } else {
                //#region Token not found
                throw new InvalidTokenException(
                  refresh_token,
                  AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
                  req.method,
                  req.url,
                );
                //#endregion
              }
            //#endregion
          }
        }
      } else {
        //#region Token not found
        throw new InvalidTokenException(
          refresh_token,
          AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
          req.method,
          req.url,
        );
        //#endregion
      }
      //#endregion
    } catch (err) {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url + ': ' + err.message);

      if (err instanceof HttpException) throw err;
      else if (params.refresh_token) {
        throw new UnauthorizedException(
          params.refresh_token,
          AUTHENTICATION_EXIT_CODE.EXPIRED_TOKEN,
          req.method,
          req.url,
        );
      } else {
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
   * @url /api/auth/logout
   * @access public
   * @returns HttpResponse | HttpException
   * @description Logout the account
   * @page Any page
   */
  @Get('/logout')
  @UseGuards(LogoutGuard)
  async logout(@Req() req: Request): Promise<HttpNoneResponse | HttpException> {
    try {
      console.log('----------------------------------------------------------');
      console.log(req.method + ' - ' + req.url);

      this._logger.writeLog(Levels.LOG, req.method, req.url, null);

      if (req.user) {
        const user_id = (req.user as JwtPayload).user_id;
        const session = await this._authService.getProfile(user_id);
        if (session) {
          //#region Cacncel session
          await this._authService.update(null, new Date(), session);
          //#endregion
        }
      }

      return {
        errorCode: 0,
        message: null,
        errors: null,
      };
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
