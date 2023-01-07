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

import { returnObjects, sprintf } from '../../../utils';

import {
  generateAccessToken,
  generateRefreshToken,
  generateResponse,
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

import { AuthService } from '../services/auth.service';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { ErrorMessage } from '../constants/enums/errors.enum';

import { HandlerException } from '../../../exceptions/HandlerException';
import { InvalidTokenException } from '../exceptions/InvalidTokenException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { UnknownException } from '../../../exceptions/UnknownException';

import { JwtAuthGuard } from '../guards/jwt.guard';
import { LogoutGuard } from '../guards/logout.guard';

import { Configuration } from '../../shared/constants/configuration.enum';
import { Levels } from '../../../constants/enums/level.enum';

import {
  AUTHENTICATION_EXIT_CODE,
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/error-code.enum';
import { RoleCode } from '../../../constants/enums/role_enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
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
      const { password, username } = params;
      //#endregion

      const result = await this._authService.getUserByUsername(username);

      if (result) {
        const isMatch = validatePassword(password, result.password);

        if (isMatch) {
          //#region get role
          const role_user = await this._authService.getRoleByUserCode(
            result.std_code,
          );

          //#endregion

          //#region Generate access_token
          const access_token = generateAccessToken(
            this._jwtService,
            this._configurationService,
            result.id,
            result.std_code,
            role_user?.role?.code ?? 0,
          );
          //#endregion

          //#region Generate refresh_token
          const refresh_token = generateRefreshToken(
            this._jwtService,
            this._configurationService,
            result.std_code,
          );
          //#endregion

          //#region Generate session
          let session = await this._authService.contains(username);

          if (!session) {
            session = await this._authService.add(
              result.id,
              result.std_code,
              result.fullname,
              result.class_id,
              result.department_id,
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

      switch (role) {
        case RoleCode.STUDENT:
        case RoleCode.MONITOR:
        case RoleCode.SECRETARY:
        case RoleCode.CHAIRMAN:
        //#region Get user by table user

        //#endregion
        case RoleCode.ADVISER:
        //#region get table teachers
        //#endregion

        case RoleCode.DEPARTMENT:
        //#region  Get table orther

        //#endregion
        case RoleCode.ADMIN:
      }
    } catch (err) {}
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

      //#region Session
      const payload = req.user as JwtPayload;
      const session = await this._authService.getProfile(payload.user_id);
      if (session) {
        //#region Generate response
        return returnObjects<ProfileResponse>({
          user_id: session.user_id,
          username: session.username,
          fullname: session.fullname,
          class_id: session.class,
          department_id: session.department,
          role: payload.role,
        });
        //#endregion
      }

      //#region throw HandlerException
      throw new UnknownException(
        (req.user as any).user_id,
        VALIDATION_EXIT_CODE.NOT_FOUND,
        req.method,
        req.url,
        sprintf(ErrorMessage.ACCOUNT_NOT_FOUND_ERROR, payload.username),
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
