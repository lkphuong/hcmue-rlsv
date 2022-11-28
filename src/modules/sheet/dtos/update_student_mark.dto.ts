import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { IsNumberValidator } from '../../../validators/number.validator';
import { MinValidator } from '../../../validators/min.validator';

export class StudentMarkDtos {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [nội dung chấm điểm].'),
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
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tiêu chí đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [tiêu chí đánh giá] tối thiểu bằng 0.',
      ),
  })
  option_id?: number = 0;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [điểm đánh giá của sinh viên].',
      ),
  })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm đánh giá của sinh viên] phải là số.',
      ),
  })
  personal_mark_level: number;
}

export class UpdateStudentMarkDto {
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
  @Type(() => StudentMarkDtos)
  data: StudentMarkDtos[];
}
