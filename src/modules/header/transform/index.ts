import { HeaderEntity } from '../../../entities/header.entity';

import { HeaderResponse } from '../interfaces/header-response.interface';

export const generateHeaders2Array = async (headers: HeaderEntity[] | null) => {
  if (headers) {
    const payload: HeaderResponse[] = [];
    for await (const header of headers) {
      const item: HeaderResponse = {
        id: header.id,
        name: header.name,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
