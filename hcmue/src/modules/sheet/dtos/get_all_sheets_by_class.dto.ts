import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetAllSheetsByClassDto {
  @Transform((params) => parseInt(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [khoa].'),
  })
  @MinValidator(0, {
    message: (arg) => generateValidationMessage(arg, 'Giá trị không hợp lệ.'),
  })
  department_id: number;

  @Transform((params) => parseInt(params.value) ?? 0)
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

  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  input: string;

  @IsOptional()
  @Transform((params) => parseInt(params.value) ?? -1)
  status?: number = -1;
}
