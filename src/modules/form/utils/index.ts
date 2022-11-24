import { HttpStatus } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';

import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { FormEntity } from 'src/entities/form.entity';

import { HandlerException } from 'src/exceptions/HandlerException';

import {
  generateForm2Object,
  generateItem2Object,
  generateTitle2Object,
  generateHeader2Object,
  generateForms2Array,
  generateHeaders2Array,
  generateItems2Array,
  generateTitles2Array,
} from '../transform';

import { ErrorMessage } from '../constants/errors.enum';
import { SERVER_EXIT_CODE } from '../../../constants/enums/error-code.enum';

export const generateResponseForms = async (
  forms: FormEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', forms);

  // Transform FormEntity[] class to FormInfoResponse[] class
  const payload = await generateForms2Array(forms);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponseForm = async (
  form: FormEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', form);

  const payload = generateForm2Object(form);

  if (query_runner) await query_runner.commitTransaction();

  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponseHeaders = async (
  headers: HeaderEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', headers);

  // Transform HeaderEntity class to ReceiptResponse class
  const payload = await generateHeaders2Array(headers);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponseHeader = async (
  header: HeaderEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', header);

  const payload = await generateHeader2Object(header);

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

export const generateResponseItems = async (
  items: ItemEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', items);

  // Transform HeaderEntity class to ReceiptResponse class
  const payload = await generateItems2Array(items);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponseItem = async (
  item: ItemEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', item);

  const payload = await generateItem2Object(item);
  if (query_runner) await query_runner.commitTransaction();
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponseTitles = async (
  titles: TitleEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', titles);

  // Transform HeaderEntity class to ReceiptResponse class
  const payload = await generateTitles2Array(titles);

  // Returns objects
  return {
    data: payload,
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateResponseTitle = async (
  title: TitleEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', title);

  const payload = generateTitle2Object(title);
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
