import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { generateValidationMessage } from 'src/utils';
import { LengthValidator } from 'src/validators/length.validator';
import { MinValidator } from 'src/validators/min.validator';

export class UpdateHeaderDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [biểu mẫu].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [biểu mẫu] tối thiểu bằng 0.'),
  })
  form_id: number;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [nội dung].'),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(arg, '[Nội dung] độ dài tối đa 500 kí tự.'),
  })
  name: string;
}
