import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsObjectIdValidator } from 'src/validators/objectId.validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetSheetsByClassDto {
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

  @IsOptional()
  input: string;
}
