import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { LengthValidator } from 'src/validators/length.validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetClassDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [Khoa].'),
  })
  @LengthValidator(1, 24, {
    message: (arg) =>
      generateValidationMessage(arg, '[Khoa] độ dài tối đa 24 kí tự.'),
  })
  department_id: string;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [academic_year_id].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [academic_year_id] tối thiểu bằng 0.',
      ),
  })
  academic_year_id: number;
}
