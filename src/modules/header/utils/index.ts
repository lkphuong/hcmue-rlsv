import { Request } from 'express';

import { HeaderEntity } from '../../../entities/header.entity';

import { generateHeaders2Array } from '../transform';

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
