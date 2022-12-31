import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { BetweenValidator } from '../../../validators/between.validator';
import { MinValidator } from '../../../validators/min.validator';
import { IsNumberValidator } from '../../../validators/number.validator';

export class ClassMarkDtos {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [hạng mục đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [hạng mục đánh giá] tối thiểu bằng 0.',
      ),
  })
  header_id: number;

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

  @IsOptional()
  @Transform((params) => params.value ?? 0)
  @BetweenValidator(0, 1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [deleted] không hợp lệ.'),
  })
  deleted?: number = 0;
}

export class UpdateClassMarkDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [vai trò].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [vai trò] tối thiểu bằng 0.'),
  })
  role_id: number;

  @IsOptional()
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng chọn [trạng thái phê duyệt].',
      ),
  })
  @Transform((params) => parseInt(params.value) ?? 1)
  @BetweenValidator(0, 1, {
    message: (arg) =>
      generateValidationMessage(arg, '[Trạng thái phê duyệt] bằng 0 hoặc 1.'),
  })
  graded?: number = 1;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClassMarkDtos)
  data: ClassMarkDtos[];
}
