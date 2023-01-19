import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';
import { LengthValidator } from '../../../validators/length.validator';

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [mã số sinh viên]'),
  })
  @LengthValidator(1, 20, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        '[Mã số sinh viên] độ dài tối đa 20 kí tự.',
      ),
  })
  std_code: string;
}
