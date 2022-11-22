import { Transform, Type } from 'class-transformer';
import {
  isEmpty,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';
import { LengthValidator } from '../../../validators/length.validator';
import { BetweenValidator } from '../../../validators/between.validator';
import { IsBooleanValidator } from 'src/validators/boolean.validator';

class OptionDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tiêu chí].'),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(arg, '[Lớp] độ dài tối đa 500 kí tự.'),
  })
  content: string;

  @IsOptional()
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm tối thiểu].'),
  })
  @MinValidator(-10, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm tối thiếu] tối thiểu bằng -10.',
      ),
  })
  from_mark: number;

  @IsOptional()
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm tối đa].'),
  })
  @MinValidator(-10, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm tối đa] tối thiểu bằng -10.',
      ),
  })
  to_mark: number;

  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [đơn vị điểm].'),
  })
  @LengthValidator(1, 50, {
    message: (arg) =>
      generateValidationMessage(arg, '[Đơn vị điểm] độ dài tối đa 50 kí tự.'),
  })
  unit: string;
}

export class CreateItemDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [thể loại].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm tối thiếu] tối thiểu bằng -10.',
      ),
  })
  title_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [input].'),
  })
  @BetweenValidator(0, 1, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [input] tối thiểu bằng Checkbox hoặc Select.',
      ),
  })
  control: number;

  @IsOptional()
  @Transform((params) => params.value ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @IsBooleanValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [multiple] không hợp lệ.'),
  })
  multiple?: boolean = true;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [nội dung chấm điểm].'),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        '[Nội dung chấm điểm] độ dài tối đa 500 kí tự.',
      ),
  })
  content: string;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @MinValidator(-10, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm tối thiếu] tối thiểu bằng -10.',
      ),
  })
  from_mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @MinValidator(-10, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [điểm tối đa] tối thiểu bằng -10.',
      ),
  })
  to_mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @BetweenValidator(0, 1, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [loại điểm] bằng 0 hoặc 1.'),
  })
  category?: number = 0;

  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [đơn vị điểm].'),
  })
  @LengthValidator(1, 50, {
    message: (arg) =>
      generateValidationMessage(arg, '[Đơn vị điểm] độ dài tối đa 50 kí tự.'),
  })
  unit: string;

  @IsOptional()
  @Transform((params) => params.value ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @IsBooleanValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [required] không hợp lệ.'),
  })
  required?: boolean = true;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
