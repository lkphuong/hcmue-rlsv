import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';
import { LengthValidator } from '../../../validators/length.validator';

export class TitleDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [biểu mẫu].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [biểu mẫu] tối thiểu bằng 0.'),
  })
  form_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn  tiêu chí đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị  tiêu chí] tối thiểu bằng 0.'),
  })
  header_id: number;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [nội dung tiêu chí đánh giá].',
      ),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        '[Nội dung tiêu chí đánh giá] độ dài tối đa 500 kí tự.',
      ),
  })
  name: string;
}
