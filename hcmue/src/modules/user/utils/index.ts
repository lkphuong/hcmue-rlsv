import { Request } from 'express';

import {
  convertObjectId2String,
  returnObjectsWithPaging,
} from '../../../utils';
import { generateUsersArray } from '../transforms';

import { UserEntity } from '../../../entities/user.entity';

import { UserResponse } from '../interfaces/users-response.interface';
import { QueryRunner } from 'typeorm';

export const generateUserIds = (users: any) => {
  return users.map((item) => {
    return convertObjectId2String(item._id);
  });
};

export const generateResponses = async (
  pages: number,
  page: number,
  users: UserEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Transform UserEntity class to UserResponse class
  const payload = await generateUsersArray(users);

  // Returns objects
  return returnObjectsWithPaging<UserResponse>(pages, page, payload);
};

export const generateImportSuccessResponse = async (
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  // Return object
  return {
    data: 'Thành công',
    errorCode: 0,
    message: null,
    errors: null,
  };
};

/**
 *
 * @param array1 sql
 * @param array2 excel
 * @param key
 * @returns
 */
export const arrayObjectDifference = (
  array1: any[],
  array2: any[],
  key: string,
) => {
  return array2.filter((x) => array1.every((y) => !y[key].includes(x[key])));
};

/**
 *
 * @param array1 sql
 * @param array2 excel
 * @returns
 */
export const arrayDifference = (array1: any[], array2: any[]) => {
  return array2.filter((x) => !array1.includes(x));
};

/**
 *
 * @param array
 * @returns
 */
export const arrayDuplicate = async (array: any[]) => {
  return array.filter((item, index) => {
    return array.indexOf(item) !== index;
  });
};
