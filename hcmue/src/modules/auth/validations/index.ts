import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import * as jsonwebtoken from 'jsonwebtoken';

import { HandlerException } from '../../../exceptions/HandlerException';
import { ExpiredTokenException } from '../exceptions/ExpiredTokenException';
import { InvalidTokenException } from '../exceptions/InvalidTokenException';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { VerifyTokenResponse } from '../interfaces/auth-response.interface';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { Configuration } from '../../shared/constants/configuration.enum';
import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { Levels } from '../../../constants/enums/level.enum';
import { JWT_ERROR } from '../../../constants/enums/jwt-error.enum';

export const validateConfirmPassword = (
  password: string,
  confirm_password: string,
  req: Request,
) => {
  if (password !== confirm_password) {
    //#region throw HandlerException
    return new HandlerException(
      VALIDATION_EXIT_CODE.NO_MATCHING,
      req.method,
      req.url,
      ErrorMessage.PASSWORD_NO_MATCHING_ERROR,
      HttpStatus.BAD_REQUEST,
    );
    //#endregion
  }

  return null;
};

export const validateToken = (
  token: string,
  configuration_service: ConfigurationService,
  log_service: LogService,
  req: Request,
) => {
  if (token) {
    //#region Decode token
    let payload:
      | VerifyTokenResponse
      | ExpiredTokenException
      | InvalidTokenException
      | null = null;
    jsonwebtoken.verify(
      token,
      configuration_service.get(Configuration.ACCESS_SECRET_KEY),
      (err, result) => {
        if (err) {
          if (err.message == JWT_ERROR.JWT_EXPIRED) {
            payload = new ExpiredTokenException(
              token,
              1003,
              req.method,
              req.url,
            );
          } else {
            payload = new InvalidTokenException(
              token,
              1002,
              req.method,
              req.url,
            );
          }
        } else {
          const { email, type } = result as VerifyTokenResponse;
          const tmp: VerifyTokenResponse = {
            email,
            type,
          };
          payload = tmp;
        }
      },
    );
    //#endregion
    return payload;
    //#endregion
  } else {
    //#region Invalid Token
    log_service.writeLog(
      Levels.ERROR,
      req.method,
      req.url,
      `Invalid Token (access_token: ${token})`,
    );

    return new InvalidTokenException(token, 1002, req.method, req.url);
    //#endregion
  }
};
