import { IsNotEmpty, IsOptional } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { BetweenValidator } from '../../../validators/between.validator';
import { LengthValidator } from '../../../validators/length.validator';

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [email]'),
  })
  @LengthValidator(1, 255, {
    message: (arg) =>
      generateValidationMessage(arg, '[Email] độ dài tối đa 255 kí tự.'),
  })
  email: string;

  @IsOptional()
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [hình thức].'),
  })
  @BetweenValidator(1, 4, {
    message: (arg) =>
      generateValidationMessage(arg, '[Hình thức] có giá trị từ 1 đến 4.'),
  })
  type?: number = 1; // 1 Sinh viên or Lớp, 2 Cố vấn học tập 3 Khoa, 4 Admin
}
