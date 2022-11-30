import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class AcademicYearDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [năm bắt đầu].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [năm bắt đầu] tối thiểu bằng 0.'),
  })
  form: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [năm kết thúc].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [năm kết thúc] tối thiểu bằng 0.',
      ),
  })
  to: number;
}
