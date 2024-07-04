import { Transform, Type } from 'class-transformer';
import {
  isEmpty,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { generateValidationMessage } from '../../../utils';

import { BetweenValidator } from '../../../validators/between.validator';
import { IsBooleanValidator } from '../../../validators/boolean.validator';
import { IsNumberValidator } from '../../../validators/number.validator';
import { LengthValidator } from '../../../validators/length.validator';
import { MinValidator } from '../../../validators/min.validator';

export class OptionDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [nội dung chi tiết].'),
  })
  @LengthValidator(1, 500, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        '[Nội dung chi tiết] độ dài tối đa 500 kí tự.',
      ),
  })
  content: string;

  @Transform((params) => parseFloat(params.value) ?? 0)
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [điểm].'),
  })
  // @NotEqualsValidator(0, {
  //   message: (arg) =>
  //     generateValidationMessage(
  //       arg,
  //       'Giá trị [điểm] không hợp lệ (phải khác 0).',
  //     ),
  // })
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm] không hợp lệ.'),
  })
  mark: number;
}

export class ItemDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [biểu mẫu].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [biểu mẫu] tối thiểu bằng 0.'),
  })
  form_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng chọn [tiêu chí đánh giá].'),
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
      generateValidationMessage(arg, 'Bạn vui lòng chọn [control].'),
  })
  @BetweenValidator(0, 3, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [control] không hợp lệ (input | checkbox | single select | multiple select).',
      ),
  })
  control: number;

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
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối thiểu] không hợp lệ.'),
  })
  from_mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm tối đa] không hợp lệ.'),
  })
  to_mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
  @IsNumberValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [điểm] không hợp lệ.'),
  })
  mark?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 0)
  @ValidateIf((_object, value) => !isEmpty(value))
  @BetweenValidator(0, 2, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [loại điểm] tối thiểu bằng 0 & tối đa bằng 2.',
      ),
  })
  category?: number = 0;

  @IsOptional()
  @Transform((params) => parseFloat(params.value) ?? 1)
  @BetweenValidator(1, 6, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Giá trị [xếp loại] tối thiểu bằng 0 & tối đa bằng 6.',
      ),
  })
  sort_order?: number = 1;

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
      generateValidationMessage(arg, 'Giá trị [bắt buộc] không hợp lệ.'),
  })
  required?: boolean = true;

  @IsOptional()
  @Transform((params) => params.value ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @IsBooleanValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [file] không hợp lệ.'),
  })
  is_file?: boolean = false;

  @IsOptional()
  @Transform((params) => params.value ?? true)
  @ValidateIf((_object, value) => !isEmpty(value))
  @IsBooleanValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [kỷ luật] không hợp lệ.'),
  })
  descipline?: boolean = false;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
