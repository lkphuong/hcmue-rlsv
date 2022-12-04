import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { IsObjectIdValidator } from '../../../validators/objectId.validator';

export class GetClassDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [khoa].'),
  })
  @IsObjectIdValidator({
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  department_id: string;
}
