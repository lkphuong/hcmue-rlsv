import { ClientProxy } from '@nestjs/microservices';
import { SheetsPayload } from '../interfaces/payloads/sheet_payload.interface';

export const send = async (
  pattern: string,
  data: SheetsPayload,
  background_client: ClientProxy,
): Promise<any> => {
  return new Promise<any>((resolve) => {
    background_client
      .send<any, SheetsPayload>(pattern, data)
      .subscribe((result) => resolve(result));
  });
};
