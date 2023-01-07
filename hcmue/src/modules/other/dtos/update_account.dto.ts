import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { EmailValidator } from '../../../validators/email.validator';
import { LengthValidator } from '../../../validators/length.validator';

export class UpdateAccountDto {
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
}
