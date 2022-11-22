import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { DateStringValidator } from 'src/validators/date.string.validator';

import { generateValidationMessage } from '../../../utils';

import { MinValidator } from '../../../validators/min.validator';

class TimeDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [ngày bắt đầu].'),
  })
  @DateStringValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [ngày bắt đầu] không hợp lệ.'),
  })
  start: string;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [ngày kết thúc].'),
  })
  @DateStringValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [ngày kết thúc] không hợp lệ.'),
  })
  end: string;
}

export class CreateFormDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [niên khóa].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [niên khóa] tối thiểu bằng 0.'),
  })
  academic_id: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Bạn vui lòng nhập [học kì].'),
  })
  @MinValidator(0, {
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [học kì] tối thiểu bằng 0.'),
  })
  semester_id: number;

  @ValidateNested({ each: true })
  @Type(() => TimeDto)
  student: TimeDto;

  @ValidateNested({ each: true })
  @Type(() => TimeDto)
  classes: TimeDto;

  @ValidateNested({ each: true })
  @Type(() => TimeDto)
  department: TimeDto;
}
