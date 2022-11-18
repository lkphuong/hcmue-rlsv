import { UserService } from '../../user/services/user.service';

import { User } from '../../../schemas/user.schema';

import {
  SheetClassResponse,
  SheetUsersResponse,
} from '../interfaces/sheet_response.interface';

import { SheetEntity } from '../../../entities/sheet.entity';

import { convertObjectId2String } from 'src/utils';

export const generateSheets2SheetUsuer = (sheets: SheetEntity[] | null) => {
  if (sheets && sheets.length > 0) {
    const payload: SheetUsersResponse[] = [];
    for (const sheet of sheets) {
      const item: SheetUsersResponse = {
        id: sheet.id,
        semester: {
          id: sheet.semester.id,
          name: sheet.semester.name,
        },
        academic: {
          id: sheet.academic_year.id,
          name: sheet.academic_year.name,
        },
        level: {
          id: sheet.level.id,
          name: sheet.level.name,
        },
        sum_of_personal_marks: sheet.sum_of_personal_marks,
        sum_of_class_marks: sheet.sum_of_class_marks,
        sum_of_department_marks: sheet.sum_of_department_marks,
        status: sheet.status,
      };
      payload.push(item);
    }
    return payload;
  }

  return null;
};

export const generateSheets2Class = async (
  sheets: SheetEntity[] | null,
  user_service: UserService,
  input?: string,
) => {
  if (sheets && sheets.length > 0) {
    const payload: SheetClassResponse[] = [];
    for (const sheet of sheets) {
      let result: User = null;
      if (input) {
        result = await user_service.getUserByInput(sheet.user_id, input);
      } else {
        result = await user_service.getUserById(sheet.user_id);
      }
      console.log('result: ', result);
      if (result) {
        const item: SheetClassResponse = {
          id: sheet.id,
          user: {
            id: convertObjectId2String(result._id),
            fullname: result.fullname,
            mssv: result.username,
          },
          level: {
            id: sheet.level.id,
            name: sheet.level.name,
          },
          sum_of_personal_marks: sheet.sum_of_personal_marks,
          sum_of_department_marks: sheet.sum_of_class_marks,
          sum_of_class_marks: sheet.sum_of_department_marks,
          status: sheet.status,
        };
        payload.push(item);
      }
    }

    return payload;
  }

  return null;
};
