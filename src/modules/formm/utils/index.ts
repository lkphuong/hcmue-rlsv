import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { FormEntity } from 'src/entities/form.entity';
import { ItemEntity } from 'src/entities/item.entity';
import { TitleEntity } from 'src/entities/title.entity';

import { HandlerException } from 'src/exceptions/HandlerException';

import { generateCreateForm, generateItem, generateTitle } from '../transform';

import { ErrorMessage } from '../constants/errors.enum';
import { SERVER_EXIT_CODE } from 'src/constants/enums/error-code.enum';

export const generateDataCreateForm2Object = async (
  form: FormEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', form);

  const payload = generateCreateForm(form);

  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateDataTitle2Object = async (
  title: TitleEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', title);

  const payload = generateTitle(title);
  if (query_runner) await query_runner.commitTransaction();
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateDataItem2Object = async (
  item: ItemEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', item);

  const payload = generateItem(item);
  if (query_runner) await query_runner.commitTransaction();
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateFailedResponse = (req: Request, message?: string) => {
  return new HandlerException(
    SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
    req.method,
    req.url,
    message ?? ErrorMessage.OPERATOR_FORM_ERROR,
    HttpStatus.EXPECTATION_FAILED,
  );
};
