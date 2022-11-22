import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';
import { LengthValidator } from '../../../validators/length.validator';

export class CreateTitleDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [hạng mục].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [hạng mục] tối thiểu bằng 0.'),
  })
  header_id: number;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tiêu chí].'),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(arg, '[Lớp] độ dài tối đa 500 kí tự.'),
  })
  name: string;
}
