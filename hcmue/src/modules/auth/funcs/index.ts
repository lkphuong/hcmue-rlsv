import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import * as nodemailer from 'nodemailer';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { UserService } from '../../user/services/user.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Configuration } from '../../shared/constants/configuration.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { DATABASE_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const sendEmail = async (
  std_code: string,
  configuration_service: ConfigurationService,
  jwt_service: JwtService,
  user_service: UserService,
  req: Request,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    ignoreTLS: true,
    secure: true,
    auth: {
      user: configuration_service.get(Configuration.EMAIL_USERNAME),
      pass: configuration_service.get(Configuration.EMAIL_PASSWORD),
    },
  });

  //#region Get user by std_code
  const user = await user_service.getUserByCode(std_code);
  if (!user) {
    //#region throw HandlerException
    return new HandlerException(
      DATABASE_EXIT_CODE.UNKNOW_VALUE,
      req.method,
      req.url,
      ErrorMessage.ACCOUNT_NOT_FOUND_ERROR,
      HttpStatus.NOT_FOUND,
    );
    //#endregion
  }
  //#endregion

  //#region Generate token
  const payload = {
    username: user.std_code,
  };

  const token = jwt_service.sign(payload, {
    secret: configuration_service.get(Configuration.ACCESS_SECRET_KEY),
    expiresIn: configuration_service.get(
      Configuration.FORGOT_PASSWORD_TOKEN_EXPIRESIN,
    ),
  });

  //#region generate url
  const url =
    configuration_service.get(Configuration.FORGOT_PASSWORD_URL) + token;
  //#endregion
  //#endregion

  const mailOptions = {
    from: 'Hỗ trợ sinh viên',
    to: 'lekhphuong@gmail.com',
    subject: 'Subject',
    text: 'Email content',
    html: `Nhập vào đường link để được cấp lại mật khẩu: ${url}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
};
