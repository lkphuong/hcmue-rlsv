import { DepartmentEntity } from '../../../entities/department.entity';
import { DepartmentResponse } from '../interfaces/department_response';

export const generateData2Array = (departments: DepartmentEntity[]) => {
  if (departments) {
    const payload: DepartmentResponse[] = [];
    for (const department of departments) {
      const item: DepartmentResponse = {
        id: department.id,
        name: department.name,
      };
      payload.push(item);
    }

    return payload;
  }

  return null;
};
