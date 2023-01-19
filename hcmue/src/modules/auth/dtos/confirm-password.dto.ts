import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';
import { LengthValidator } from '../../../validators/length.validator';

export class ConfirmPasswordDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [mật khẩu mới]'),
  })
  @LengthValidator(1, 50, {
    message: (arg) =>
      generateValidationMessage(arg, '[Mật khẩu] độ dài tối đa 50 kí tự.'),
  })
  new_password: string;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [mật khẩu xác nhận]'),
  })
  @LengthValidator(1, 50, {
    message: (arg) =>
      generateValidationMessage(arg, '[Mật khẩu] độ dài tối đa 50 kí tự.'),
  })
  confirm_password: string;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [token]'),
  })
  @LengthValidator(1, 255, {
    message: (arg) =>
      generateValidationMessage(arg, '[token] độ dài tối đa 255 kí tự.'),
  })
  token: string;
}
