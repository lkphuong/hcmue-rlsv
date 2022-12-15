import { ClientProxy } from '@nestjs/microservices';
import { ApprovalPayload } from '../interfaces/payloads/approval_payload.interface';

export const send = async (
  pattern: string,
  data: ApprovalPayload,
  tracking_client: ClientProxy,
): Promise<any> => {
  return new Promise<void | null>((resolve) => {
    tracking_client
      .send<any, ApprovalPayload>(pattern, data)
      .subscribe((result) => {
        resolve(result);
      });
  });
};
