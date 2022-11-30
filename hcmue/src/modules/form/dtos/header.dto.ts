import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { GreaterValidator } from 'src/validators/greater.validator';

import { generateValidationMessage } from '../../../utils';

import { LengthValidator } from '../../../validators/length.validator';
import { MinValidator } from '../../../validators/min.validator';

export class HeaderDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [biểu mẫu].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [biểu mẫu] tối thiểu bằng 0.'),
  })
  form_id: number;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [nội dung hạng mục đáng giá].',
      ),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        '[Nội dung hạng mục đáng giá] độ dài tối đa 500 kí tự.',
      ),
  })
  name: string;

  @Transform((params) => parseFloat(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [điểm tối đa cho hạng mục].',
      ),
  })
  @GreaterValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm tối đa] không hợp lệ (phải lớn hơn 0).',
      ),
  })
  max_mark: number;
}
