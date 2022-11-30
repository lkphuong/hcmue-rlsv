import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetDetailTitleDto {
  @IsNotEmpty({
    message: (arg) => generateValidationMessage(arg, 'Bạn vui lòng nhập [id].'),
  })
  @Transform((params) => parseInt(params.value) ?? 0)
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [id] tối thiểu bằng 1.'),
  })
  id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [hạng mục].'),
  })
  @Transform((params) => parseInt(params.value) ?? 0)
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [hạng mục] tối thiểu bằng 1.'),
  })
  title_id: number;
}
