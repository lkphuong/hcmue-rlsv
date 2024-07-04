import { IsOptional } from 'class-validator';
import { DateStringValidator } from '../../../validators/date.string.validator';
import { generateValidationMessage } from '../../../utils';

export class TimeDto {
  @IsOptional()
  @DateStringValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [ngày kết thúc] không hợp lệ.'),
  })
  start: string;

  @IsOptional()
  @DateStringValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Giá trị [ngày kết thúc] không hợp lệ.'),
  })
  end: string;

  @IsOptional()
  status: number;
}
