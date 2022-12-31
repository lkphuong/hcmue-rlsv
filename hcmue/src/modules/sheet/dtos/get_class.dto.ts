import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetClassDto {
  @IsOptional()
  @Transform((params) => parseInt(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [lớp].'),
  })
  @MinValidator(0, {
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  class_id: number;
}
