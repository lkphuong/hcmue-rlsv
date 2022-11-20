import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

class DataDtos {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tiêu chí đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [tiêu chí đánh giá] tối thiểu bằng 0.',
      ),
  })
  form_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tiêu chí đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [tiêu chí đánh giá] tối thiểu bằng 0.',
      ),
  })
  evaluation_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm đánh giá] tối thiểu bằng 0.',
      ),
  })
  personal_mark_level: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm đánh giá] tối thiểu bằng 0.',
      ),
  })
  class_mark_level: number;
}

export class UpdateMarkClass {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [vai trò].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [vai trò] tối thiểu bằng 0.'),
  })
  role_id: number;

  @ValidateNested({ each: true })
  @Type(() => DataDtos)
  data: DataDtos[];
}
