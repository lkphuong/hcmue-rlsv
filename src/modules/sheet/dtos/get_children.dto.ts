import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { LengthValidator } from 'src/validators/length.validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

export class GetChildrenEvaluationDto {
  @Transform((params) => (params.value ? parseInt(params.value) : params.value))
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [biểu mẫu].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [biểu mẫu] tối thiểu bằng 0.'),
  })
  id: number;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [liên kết].'),
  })
  @LengthValidator(1, 50, {
    message: (arg) =>
      generateValidationMessage(arg, '[Liên kết] độ dài tối đa 50 kí tự.'),
  })
  parent_id: string;
}
