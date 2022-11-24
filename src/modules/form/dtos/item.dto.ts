import { Transform, Type } from 'class-transformer';
import {
  isEmpty,
  IsNotEmpty,
  isNumber,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';
import { LengthValidator } from '../../../validators/length.validator';
import { BetweenValidator } from '../../../validators/between.validator';
import { IsBooleanValidator } from '../../../validators/boolean.validator';
import { IsNumberValidator } from '../../../validators/number.validator';

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
      generateValidationMessage(arg, '[Tiêu chí] độ dài tối đa 500 kí tự.'),
  })
  content: string;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm tối thiểu].'),
  })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối thiểu] phải là số.'),
  })
  from_mark: number;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm tối đa].'),
  })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối đa] phải là số.'),
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

export class ItemDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [tiêu chí đánh giá].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [tiêu chí đánh giá] tối thiểu bằng 1.',
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
        'Giá trị [input] là Checkbox hoặc Select.',
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
  @Transform((params) => parseFloat(params.value) ?? 0)
  @ValidateIf((_object, value) => !isNumber(value))
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối thiểu] không hợp lệ].'),
  })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối thiểu] phải là số.'),
  })
  from_mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
  @ValidateIf((_object, value) => !isNumber(value))
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối đa] không hợp lệ].'),
  })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối đa] phải là số.'),
  })
  to_mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
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
