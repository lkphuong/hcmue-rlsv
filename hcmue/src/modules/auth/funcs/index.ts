import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import * as nodemailer from 'nodemailer';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { HandlerException } from '../../../exceptions/HandlerException';

import { Configuration } from '../../shared/constants/configuration.enum';
import { ErrorMessage } from '../constants/enums/errors.enum';
import { UNKNOW_EXIT_CODE } from '../../../constants/enums/error-code.enum';
import { forgotPasswordSuccess } from '../utils';
import { sprintf } from '../../../utils';
import { EMAIL_CONTENT } from '../constants';

export const sendEmail = async (
  email: string,
  type: number,
  configuration_service: ConfigurationService,
  jwt_service: JwtService,
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

  //#region Generate token
  const payload = {
    email: email,
    type: type,
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
    to: `${email}`,
    subject: 'LẤY LẠI MẬT KHẨU',
    text: 'Thông báo về việc yêu câu lấy lại mật khẩu.',
    html: sprintf(EMAIL_CONTENT, url, url),
  };

  let flag = true;
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('error: ', error);
      flag = false;
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  if (flag) {
    return forgotPasswordSuccess(email, req);
  } else {
    //#region throw HandlerException
    return new HandlerException(
      UNKNOW_EXIT_CODE.UNKNOW_ERROR,
      req.method,
      req.url,
      ErrorMessage.OPERATOR_SEND_EMAIL_ERROR,
      HttpStatus.EXPECTATION_FAILED,
    );
    //#endregion
  }
};
