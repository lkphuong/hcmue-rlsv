import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { LengthValidator } from 'src/validators/length.validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetClassDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [học kì].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [học kì] tối thiểu bằng 0.'),
  })
  semester_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [niên khóa].'),
  })
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
      generateValidationMessage(arg, '[Khoa] độ dài tối đa 24 kí tự.'),
  })
  class_id: string;
}
