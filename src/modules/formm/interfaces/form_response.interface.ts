export interface TimeResponse {
  start: Date;
  end: Date;
}

export interface BaseResponse {
  id: number;
  name: string;
}

export interface CreateFormResponse {
  id: number;
  academic: BaseResponse;
  semester: BaseResponse;
  student: TimeResponse;
  class: TimeResponse;
  department: TimeResponse;
}

export interface OptionResponse {
  content: string;
  from_mark: number;
  to_mark: number;
  unit: string;
}

export interface ItemResponse {
  id: number;
  control: number;
  multiple: boolean;
  content: string;
  from_mark: number;
  to_mark: number;
  category: number;
  unit: string;
  required: boolean;
  options: OptionResponse[];
}
