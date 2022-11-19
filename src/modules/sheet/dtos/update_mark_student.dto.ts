import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

class DataDtos {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [form_id].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [form_id] tối thiểu bằng 0.'),
  })
  form_id: number;

  @IsOptional()
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [evaluation_id].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [evaluation_id] tối thiểu bằng 0.',
      ),
  })
  evaluation_id?: number = 0;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Bạn vui lòng nhập [personal_mark_level].',
      ),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [personal_mark_level] tối thiểu bằng 0.',
      ),
  })
  personal_mark_level: number;
}

export class UpdateMarkStudent {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [role_id].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [role_id] tối thiểu bằng 0.'),
  })
  role_id: number;

  @ValidateNested({ each: true })
  @Type(() => DataDtos)
  data: DataDtos[];
}
