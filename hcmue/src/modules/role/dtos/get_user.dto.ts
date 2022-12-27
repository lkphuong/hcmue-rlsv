import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetUserDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [khoa].'),
  })
  @MinValidator(0, {
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  department_id: number;

  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [lớp].'),
  })
  @MinValidator(0, {
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  class_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [vai trò].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [vai trò] tối thiểu bằng 0.'),
  })
  role_id: number;
}
