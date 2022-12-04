import { convertObjectId2String } from '../../../utils';

import { Class } from '../../../schemas/class.schema';

import { ClassResponse } from '../interfaces/class_response.interface';

export const generateData2Array = ($class: Class[] | null) => {
  if ($class && $class.length > 0) {
    const payload: ClassResponse[] = [];
    for (const item of $class) {
      const result: ClassResponse = {
        id: convertObjectId2String(item._id),
        name: item.name,
      };

      payload.push(result);
    }

    return payload;
  }

  return null;
};
