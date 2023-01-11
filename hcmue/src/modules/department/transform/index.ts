import { DepartmentResponse } from '../interfaces/department_response.interface';

export const generateData2Array = (departments: DepartmentResponse[]) => {
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
