import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';
import { EmailValidator } from '../../../validators/email.validator';

import { LengthValidator } from '../../../validators/length.validator';
import { MinValidator } from '../../../validators/min.validator';

export class CreateAccountDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [khoa].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [khoa] tối thiểu bằng 1.'),
  })
  department_id: number;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tên đăng nhập].'),
  })
  @LengthValidator(1, 255, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        '[tên đăng nhập] đồ dài tối đa 255 kí tự.',
      ),
  })
  @EmailValidator({
    message: (arg) =>
      generateValidationMessage(arg, '[tên đăng nhập] phải là email.'),
  })
  username: string;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [mật khẩu].'),
  })
  @LengthValidator(1, 255, {
    message: (arg) =>
      generateValidationMessage(arg, '[mật khẩu] đồ dài tối đa 255 kí tự.'),
  })
  password: string;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [mật khẩu].'),
  })
  @LengthValidator(1, 255, {
    message: (arg) =>
      generateValidationMessage(arg, '[mật khẩu] đồ dài tối đa 255 kí tự.'),
  })
  confirm_password: string;
}
