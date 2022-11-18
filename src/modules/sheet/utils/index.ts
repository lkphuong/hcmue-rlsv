import { Request } from 'express';

import { UserService } from '../../user/services/user.service';

import { SheetEntity } from '../../../entities/sheet.entity';
import { returnObjectsWithPaging } from 'src/utils';

import {
  generateSheets2SheetUsuer,
  generateSheets2Class,
} from '../transform/index';

export const generateResponseSheetUser = async (
  pages: number,
  page: number,
  sheets: SheetEntity[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('pages: ', pages);
  console.log('page: ', page);
  console.log('data: ', sheets);

  // Transform SheetEntity class to
  const payload = generateSheets2SheetUsuer(sheets);

  // Returns data
  return returnObjectsWithPaging(pages, page, payload);
};

export const generateResponseSheetClass = async (
  pages: number,
  page: number,
  input: string,
  sheets: SheetEntity[],
  user_service: UserService,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);
  console.log('pages: ', pages);
  console.log('page: ', page);
  console.log('data: ', sheets);

  // Transform SheetEntity class to
  const payload = await generateSheets2Class(sheets, user_service, input);

  // Returns data
  return returnObjectsWithPaging(pages, page, payload);
};
