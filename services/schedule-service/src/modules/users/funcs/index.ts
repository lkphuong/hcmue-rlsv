import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

import {
  SheetPayload,
  SheetsPayload,
} from '../interfaces/payloads/sheet_payload.interface';

import { Message } from '../constants/enums/message.enum';

export const send = async (
  results: SheetPayload[],
  composer_client: ClientProxy,
): Promise<any> => {
  return new Promise<any>((resolve) => {
    composer_client
      .send<any, SheetsPayload>(Message.GENERATE_CREATE_SHEET_ENTITY, {
        payload: {
          data: results,
        },
      })
      .pipe(
        map((results) => {
          return results;
        }),
        catchError(() => {
          return null;
        }),
      )
      .subscribe((result) => resolve(result));
  });
};
