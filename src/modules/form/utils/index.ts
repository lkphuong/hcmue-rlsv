import * as uuid from 'uuid';
import { Request } from 'express';
import { FormResponse } from '../interfaces/form_response.interface';

import { HeaderEntity } from '../../../entities/header.entity';

import { generateForms2Array, generateHeaders2Array } from '../transform';
import { ItemEntity } from '../../../entities/item.entity';

import { generateItems2Array } from '../transform';

import { TitleEntity } from '../../../entities/title.entity';

import { generateTitles2Array } from '../transform';
import { FormEntity } from 'src/entities/form.entity';
import { QueryRunner } from 'typeorm';

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

export const generateResponseForm = async (form: FormEntity, req: Request) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('data: ', form);

  // Returns objects
  return {
    data: {
      id: form.id,
      academic: {
        id: form.academic_year.id,
        name: form.academic_year.name,
      },
      semester: {
        id: form.semester.id,
        name: form.semester.name,
      },
      student: {
        start: form.student_start,
        end: form.student_end,
      },
      class: {
        start: form.class_start,
        end: form.class_end,
      },
      department: {
        start: form.department_start,
        end: form.department_end,
      },
    },
    errorCode: 0,
    message: null,
    errors: null,
  };
};

export const generateSuccessResponse = async (
  header: HeaderEntity,
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('header: ', header);

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  // Return object
  return {
    data: {
      id: header.id,
      name: header.name,
    },
    errorCode: 0,
    message: null,
    errors: null,
  };
};
