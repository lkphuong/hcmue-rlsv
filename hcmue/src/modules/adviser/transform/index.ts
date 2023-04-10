import { AdviserEntity } from '../../../entities/adviser.entity';
import { GetAdviserResponse } from '../interfaces/adviser-response.interface';

export const generateResponse = (advisers: AdviserEntity[]) => {
  const payload: GetAdviserResponse[] = [];

  for (const i of advisers) {
    const adviser: GetAdviserResponse = {
      id: i.id,
      fullname: i.fullname,
      email: i.email,
      phone_number: i.phone_number,
      code: i.code,
      degree: i.degree,
      department: i.department.name,
      classes: [],
    };

    if (i.adviser_classes) {
      for (const j of i.adviser_classes) {
        if (j.class && j.class.name) {
          adviser.classes.push(j.class.code);
        }
      }
    }
    payload.push(adviser);
  }

  return payload;
};
