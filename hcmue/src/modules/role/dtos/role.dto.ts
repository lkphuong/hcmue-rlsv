import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { LengthValidator } from '../../../validators/length.validator';
import { MinValidator } from '../../../validators/min.validator';

export class RoleDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [khoa].'),
  })
  @LengthValidator(1, 24, {
    message: (arg) =>
      generateValidationMessage(arg, '[Khoa] độ dài tối đa 24 kí tự.'),
  })
  department: string;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [lớp].'),
  })
  @LengthValidator(1, 24, {
    message: (arg) =>
      generateValidationMessage(arg, '[Lớp] độ dài tối đa 24 kí tự.'),
  })
  classes: string;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [quyền].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [quyền] tối thiểu bằng 0.'),
  })
  role_id: number;
}
