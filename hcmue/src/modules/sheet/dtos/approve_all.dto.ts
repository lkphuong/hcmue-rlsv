import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { IsBooleanValidator } from '../../../validators/boolean.validator';
import { MinValidator } from '../../../validators/min.validator';

export class ApproveAllDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [hình thức].'),
  })
  @IsBooleanValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [hình thức] không hợp lệ.'),
  })
  all: number;

  @IsOptional()
  include_ids: number[];

  @IsOptional()
  except_ids: number[];

  @Transform((params) => parseInt(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [khoa].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [khoa] không hợp lệ.'),
  })
  department_id: number;

  @IsOptional()
  @Transform((params) => parseInt(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [lớp].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [lớp] không hợp lệ.'),
  })
  class_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [niên khóa].'),
  })
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [niên khóa] tối thiểu bằng 1.'),
  })
  academic_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [học kì].'),
  })
  @Transform((params) => parseInt(params.value) ?? 0)
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [học kì] tối thiểu bằng 1.'),
  })
  semester_id: number;
}
