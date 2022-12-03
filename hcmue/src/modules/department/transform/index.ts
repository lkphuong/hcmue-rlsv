import { convertObjectId2String } from '../../../utils';
import { Department } from '../../../schemas/department.schema';
import { DepartmentResponse } from '../interfaces/department_response';

export const generateData2Array = (departments: Department[]) => {
  if (departments) {
    const payload: DepartmentResponse[] = [];
    for (const department of departments) {
      const item: DepartmentResponse = {
        id: convertObjectId2String(department._id),
        name: department.name,
      };
      payload.push(item);
    }

    return payload;
  }

  return null;
};
