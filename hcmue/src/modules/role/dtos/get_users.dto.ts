import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { LengthValidator } from 'src/validators/length.validator';
import { MinValidator } from '../../../validators/min.validator';

export class GetUsersDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [pages].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [pages] tối thiểu bằng 0.'),
  })
  pages: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [page].'),
  })
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [page] tối thiểu bằng 1.'),
  })
  page: number;

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

  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [input].'),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(arg, '[input] độ dài tối đa 500 kí tự.'),
  })
  input: string;
}
