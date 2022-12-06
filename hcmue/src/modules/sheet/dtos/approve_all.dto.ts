import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { IsBooleanValidator } from '../../../validators/boolean.validator';
import { IsObjectIdValidator } from '../../../validators/objectId.validator';
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
  @ArrayNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [phiếu đánh giá].'),
  })
  @MinValidator(1, {
    each: true,
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [phiếu đánh giá] không hợp lệ.'),
  })
  include_ids: number[];

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [khoa].'),
  })
  @IsObjectIdValidator({
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  department_id: string;

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
