import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

import { SheetEntity } from '../../../entities/sheet.entity';

import { SheetPayload } from '../interfaces/payloads/approval_payload.interface';

import { Message } from '../constants/enums/message.enum';

export const send = async (
  results: SheetEntity[],
  background_client: ClientProxy,
): Promise<any> => {
  return new Promise<any>((resolve) => {
    background_client
      .send<any, SheetPayload>(Message.GENERATE_UPDATE_APPROVED_STATUS, {
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
