import { Request } from 'express';

import { TitleEntity } from '../../../entities/title.entity';

import { generateTitles2Array } from '../transform';

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
