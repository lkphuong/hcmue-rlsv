import { FormStatus } from '../constants/enums/statuses.enum';

export interface BaseResponse {
  id: number;
  name: string;
}

export interface FormResponse {
  id: number;
  academic: BaseResponse;
  semester: BaseResponse;
  student: TimeResponse;
  classes: TimeResponse;
  department: TimeResponse;
  status: FormStatus;
  created_at?: Date;
}

export interface HeaderResponse extends BaseResponse {
  max_mark: number;
}

export interface ItemResponse {
  id: number;
  control: number;
  multiple: boolean;
  content: string;
  from_mark: number;
  to_mark: number;
  mark: number;
  category: number;
  unit: string;
  required: boolean;
  is_file: boolean;
  sort_order: number;
  options?: OptionResponse[] | null;
}

export interface OptionResponse {
  id: number;
  content: string;
  mark: number;
}

export interface TimeResponse {
  start: Date;
  end: Date;
}
