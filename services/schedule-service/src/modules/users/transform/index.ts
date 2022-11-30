import { FormEntity } from '../../../entities/form.entity';

import { convertObjectId2String } from '../../../utils';

import { SheetPayload } from '../interfaces/payloads/sheet-payload.interface';

export const generateSheet2Array = async (
  form: FormEntity,
  flag: boolean,
  users: any | null,
) => {
  if (users && users.length > 0) {
    const payload: SheetPayload[] = [];
    for await (const user of users) {
      const item: SheetPayload = {
        form: form,
        user_id: convertObjectId2String(user._id),
        academic_year: form.academic_year,
        semester: form.semester,
        department_id: convertObjectId2String(user.departmentId),
        class_id: convertObjectId2String(user.classId),
        k: convertObjectId2String(user.k._id),
        flag: false,
      };
      payload.push(item);
    }

    if (flag) {
      payload[payload.length - 1].flag = flag;
    }

    return payload;
  }

  return null;
};
