import { IsNotEmpty, IsOptional } from 'class-validator';

import { MinValidator } from '../../../validators/min.validator';

import { generateValidationMessage } from '../../../utils';

export class MultiApproveDto {
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
  @MinValidator(1, {
    each: true,
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [biểu mẫu] không hợp lệ.'),
  })
  sheet_ids: number[];
}
