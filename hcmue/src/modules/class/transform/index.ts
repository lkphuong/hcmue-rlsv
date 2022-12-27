import { ClassEntity } from '../../../entities/class.entity';

import { ClassResponse } from '../interfaces/class_response.interface';

export const generateData2Array = ($class: ClassEntity[] | null) => {
  if ($class && $class.length > 0) {
    const payload: ClassResponse[] = [];
    for (const item of $class) {
      const result: ClassResponse = {
        id: item.id,
        name: item.name,
      };

      payload.push(result);
    }

    return payload;
  }

  return null;
};
