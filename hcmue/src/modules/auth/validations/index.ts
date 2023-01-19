import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';
import { VALIDATION_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from '../../shared/constants/configuration.enum';
import { ExpiredTokenException } from '../exceptions/ExpiredTokenException';
import { JwtPayload } from '../interfaces/payloads/jwt-payload.interface';

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
  jwt_service: JwtService,
  req: Request,
) => {
  //#region Decode token
  const decoded = jwt_service.verify(token, {
    secret: configuration_service.get(Configuration.ACCESS_SECRET_KEY),
  });
  //#endregion

  //#region Expired Token
  if (Date.now() >= decoded.exp * 1000) {
    return new ExpiredTokenException(token, 1003, req.method, req.url);
  }

  return decoded as JwtPayload;
  //#endregion
};
