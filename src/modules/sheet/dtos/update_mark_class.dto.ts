import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { IsNumberValidator } from '../../../validators/number.validator';
import { MinValidator } from '../../../validators/min.validator';

class DataDtos {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [nội dung chấm điểm].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [nội dung chấm điểm] tối thiểu bằng 0.',
      ),
  })
  item_id: number;

  @IsOptional()
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [tùy chọn nội dung chấm điểm].',
      ),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [tùy chọn nội dung chấm điểm] tối thiểu bằng 0.',
      ),
  })
  option_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [điểm đánh giá của lớp].',
      ),
  })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm đánh giá của lớp] phải là số.',
      ),
  })
  class_mark_level: number;
}

export class ClassUpdateMarkDto {
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
