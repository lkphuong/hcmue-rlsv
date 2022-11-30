import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import {
  generateFormObject,
  generateFormsArray,
  generateHeaderObject,
  generateHeadersArray,
  generateItemObject,
  generateItemsArray,
  generateTitleObject,
  generateTitlesArray,
} from '../transform';

import { FormEntity } from '../../../entities/form.entity';
import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { TitleEntity } from '../../../entities/title.entity';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateFormsResponse = async (
  forms: FormEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', forms);

  // Transform FormEntity class to FormResponse class
  const payload = await generateFormsArray(forms);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateFormResponse = async (
  form: FormEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', form);

  // Transform FormEntity class to FormResponse class
  const payload = generateFormObject(form);

  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateHeadersResponse = async (
  headers: HeaderEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', headers);

  // Transform HeaderEntity to HeaderResponse class
  const payload = await generateHeadersArray(headers);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateHeaderResponse = async (
  header: HeaderEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', header);

  // Transform HeaderEntity class to HeaderResponse class
  const payload = await generateHeaderObject(header);

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  // Return object
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateItemsResponse = async (
  items: ItemEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', items);

  // Transform ItemEntity class to ItemResponse class
  const payload = await generateItemsArray(items);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateItemResponse = async (
  item: ItemEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', item);

  // Transform HeaderEntity class to ItemResponse class
  const payload = await generateItemObject(item);

  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateTitlesResponse = async (
  titles: TitleEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', titles);

  // Transform TitleEntity class to TitleResponse class
  const payload = await generateTitlesArray(titles);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateTitleResponse = async (
  title: TitleEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', title);

  // Transform TitleEntity class to TitleResponse class
  const payload = generateTitleObject(title);

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
