import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetDepartmentStatusDto {
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

  @IsOptional()
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
}
