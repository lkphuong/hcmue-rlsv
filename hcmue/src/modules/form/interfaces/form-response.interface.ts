import { FormStatus } from '../constants/enums/statuses.enum';

export interface BaseResponse {
  id: number;
  name: string;
  items?: ItemResponse[];
}

export interface FormResponse {
  id: number;
  academic: BaseResponse;
  semester: BaseResponse;
  start: Date;
  end: Date;
  status: FormStatus;
  created_at?: Date;
}

export interface DetailFormResponse extends FormResponse {
  headers: HeaderResponse[];
}

export interface HeaderResponse extends BaseResponse {
  max_mark: number;
  is_return: boolean;
  titles?: BaseResponse[];
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
  discipline: boolean;
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
