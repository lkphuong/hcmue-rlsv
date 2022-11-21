import { TitleEntity } from '../../../entities/title.entity';

import { TitleResponse } from '../interfaces/title-response.interface';

export const generateTitles2Array = async (titles: TitleEntity[] | null) => {
  if (titles) {
    const payload: TitleResponse[] = [];
    for await (const header of titles) {
      const item: TitleResponse = {
        id: header.id,
        name: header.name,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
