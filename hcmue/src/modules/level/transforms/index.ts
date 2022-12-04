import { LevelEntity } from '../../../entities/level.entity';
import { LevelResponse } from '../interfaces/get-levels-response.interface';

export const generateLevelsArray = async (levels: LevelEntity[] | null) => {
  if (levels && levels.length > 0) {
    const payload: LevelResponse[] = [];

    for await (const level of levels) {
      const item: LevelResponse = {
        id: level.id,
        name: level.name,
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
