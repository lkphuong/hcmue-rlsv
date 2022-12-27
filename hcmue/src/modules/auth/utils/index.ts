import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { returnObjects } from '../../../utils';

import { SessionEntity } from '../../../entities/session.entity';

import { Configuration } from '../../shared/constants/configuration.enum';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { JwtPayload } from '../interfaces/payloads/jwt-payload.interface';

import { GetUserResponse } from '../interfaces/user-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';

export const generateAccessToken = (
  jwtService: JwtService,
  configurationService: ConfigurationService,
  user_id: number,
  username: string,
  role: number,
): string => {
  //#region generate access_token
  const payload: JwtPayload = {
    user_id: user_id,
    username: username,
    role: role,
  };

  const access_token = jwtService.sign(payload, {
    secret: configurationService.get(Configuration.ACCESS_SECRET_KEY),
    expiresIn: configurationService.get(Configuration.ACCESS_TOKEN_EXPIRESIN),
  });
  //#endregion

  return access_token;
};

export const generateRefreshToken = (
  jwtService: JwtService,
  configurationService: ConfigurationService,
  std_code: string,
) => {
  //#region generate refresh_token
  const refresh_token = jwtService.sign(
    {
      username: std_code,
    },
    {
      secret: configurationService.get(Configuration.REFRESH_SECRET_KEY),
      expiresIn: configurationService.get(
        Configuration.REFRESH_TOKEN_EXPIRESIN,
      ),
    },
  );
  //#endregion

  return refresh_token;
};

export const generateResponse = async (
  session: SessionEntity,
  access_token: string,
  refresh_token: string,
  req: Request,
) => {
  console.log('------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', session);

  // Returns object
  return returnObjects<LoginResponse>({
    username: session.username,
    access_token: access_token,
    refresh_token: refresh_token,
  });
};

export const generateUsersResponse = async (
  users: GetUserResponse[] | null,
  req: Request,
) => {
  console.log('------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', users);

  // Returns object
  return returnObjects<GetUserResponse>(users);
};

export const validatePassword = async (
  password: string,
  user_password: string,
) => {
  return password === user_password;
};
