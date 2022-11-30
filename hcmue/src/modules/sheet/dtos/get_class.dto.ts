import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { LengthValidator } from '../../../validators/length.validator';
import { MinValidator } from '../../../validators/min.validator';

export class GetClassDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [học kì].'),
  })
  @Transform((params) => parseInt(params.value) ?? 0)
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [học kì] tối thiểu bằng 0.'),
  })
  semester_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [niên khóa].'),
  })
  @Transform((params) => parseInt(params.value) ?? 0)
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [niên khóa] tối thiểu bằng 0.'),
  })
  academic_id: number;

  @IsOptional()
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
  class_id: string;
}
