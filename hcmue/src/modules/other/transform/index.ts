import { DepartmentEntity } from '../../../entities/department.entity';
import { OtherService } from '../services/other.service';
import { AccountDepartmentResponse } from '../interfaces/other_response.interface';

export const generateData2Array = async (
  departments: DepartmentEntity[],
  other_service: OtherService,
) => {
  const payload: AccountDepartmentResponse[] = [];
  for await (const department of departments) {
    const other = await other_service.getOtherByDepartment(department.id);
    const item: AccountDepartmentResponse = {
      department: {
        id: department.id,
        name: department.name,
      },
      username: other?.username ?? null,
    };
    payload.push(item);
  }

  return payload;
};

export const generateData2Object = async (
  department: DepartmentEntity,
  other_service: OtherService,
) => {
  const other = await other_service.getOtherByDepartment(department.id);
  const payload: AccountDepartmentResponse = {
    department: {
      id: department.id,
      name: department.name,
    },
    username: other?.username ?? null,
  };

  return payload;
};
