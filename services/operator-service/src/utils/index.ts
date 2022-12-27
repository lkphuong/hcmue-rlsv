import { ValidationArguments } from 'class-validator';

import { Types } from 'mongoose';

import * as moment from 'moment';

import { LogService } from '../modules/log/services/log.service';

import { HttpPagingResponse } from '../interfaces/http-paging-response.interface';
import { HttpResponse } from '../interfaces/http-response.interface';

import { APP_PREFIX } from '../constants';

export const handleLog = (
  level: string,
  pattern: string,
  path: string,
  error_message: string,
  logger: LogService,
) => {
  console.log('----------------------------------------------------------');
  console.log(pattern + ': ' + error_message);

  logger.writeLog(level, pattern, path, error_message);
};

export const convertString2Date = (raw: string) => {
  return moment.utc(raw).toDate();
};

export const convertString2Float = (raw: string) => {
  return parseFloat(raw);
};

export const convertString2Boolean = (raw: string) => {
  return raw === 'true' || raw === '1';
};

export const convertObjectId2String = (raw: Types.ObjectId) => {
  return raw.toString();
};

export const convertString2ObjectId = (raw: string) => {
  return new Types.ObjectId(raw);
};

export const removeDuplicates = <T>(data: T[]) => {
  return Array.from(new Set(data));
};

export const generateRedisKeyFromUrl = (url: string, payload: any) => {
  const path = `${APP_PREFIX}-${url.substring(1).split('/').join('-')}`;
  const encode = payload ? JSON.stringify(payload) : null;

  return path + (encode ? '-' + encode : '');
};

export const generateValidationMessage = (
  arg: ValidationArguments,
  message: string,
): string => JSON.stringify({ [arg.property]: message });

export const returnObjects = <T>(
  data: T | T[] | null,
  errorCode?: number,
  message?: string | null,
  errors?: [{ [key: string]: string }] | null,
): HttpResponse<T> => {
  return {
    data: data,
    errorCode: data != null ? 0 : errorCode ?? 0,
    message: data !== null ? null : message,
    errors: errors ?? null,
  };
};

export const returnObjectsWithPaging = <T>(
  pages: number,
  page: number,
  data: T | T[] | null,
  errorCode?: number,
  message?: string | null,
  errors?: [{ [key: string]: string }] | null,
): HttpPagingResponse<T> => {
  return {
    data: {
      pages,
      page,
      data,
    },
    errorCode: data != null ? 0 : errorCode ?? 9001,
    message: data !== null ? null : message,
    errors: errors ?? null,
  };
};

export const sprintf = (str, ...argv) =>
  !argv.length
    ? str
    : sprintf((str = str.replace('%s' || '$', argv.shift())), ...argv);

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
export const hashFnv32a = (
  data: string,
  length = 10,
  toString = true,
  seed?: number,
) => {
  /*jshint bitwise:false */
  let i = 0;
  const l = data.length;
  let hval = seed === undefined ? 0x811c9dc5 : seed;

  for (i = 0; i < l; i++) {
    hval ^= data.charCodeAt(i);
    hval +=
      (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }

  if (toString) {
    // Convert to 8 digit hex string
    return (hval >>> 0).toString(length);
  }

  return hval >>> 0;
};
