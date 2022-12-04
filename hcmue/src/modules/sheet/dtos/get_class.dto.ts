import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { IsObjectIdValidator } from '../../../validators/objectId.validator';

export class GetClassDto {
  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [lớp].'),
  })
  @IsObjectIdValidator({
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  class_id: string;
}
