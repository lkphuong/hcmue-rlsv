import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable } from 'rxjs';

import {
  SheetPayload,
  SheetsPayload,
} from '../interfaces/payloads/sheet_payload.interface';

import { Message } from '../constants/enums/message.enum';

export const send = async (
  page: number,
  results: SheetPayload[],
  background_client: ClientProxy,
): Promise<any> => {
  return new Promise<any>((resolve) => {
    background_client
      .send<any, SheetsPayload>(Message.GENERATE_CREATE_SHEET, {
        payload: {
          page,
          data: results,
        },
      })
      .pipe(
        map((results) => {
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log('Error: ', err);
          return caught;
        }),
      )
      .subscribe((result) => resolve(result));
  });
};
