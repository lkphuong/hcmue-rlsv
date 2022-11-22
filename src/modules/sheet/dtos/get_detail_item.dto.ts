import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetDetailTitleDto {
  @Transform((params) => (params.value ? parseInt(params.value) : params.value))
  @IsNotEmpty({
    message: (arg) => generateValidationMessage(arg, 'Bạn vui lòng nhập [id].'),
  })
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [id] tối thiểu bằng 1.'),
  })
  id: number;

  @Transform((params) => (params.value ? parseInt(params.value) : params.value))
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [title_id].'),
  })
  @MinValidator(1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [title_id] tối thiểu bằng 1.'),
  })
  title_id: number;
}
