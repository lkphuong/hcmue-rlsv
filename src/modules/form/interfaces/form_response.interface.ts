export interface BaseResponse {
  id: number;
  name: string;
}

export interface HeaderResponse extends BaseResponse {
  max_mark: number;
}

export interface TimeResponse {
  start: Date;
  end: Date;
}

export interface FormResponse {
  id: number;
  academic: BaseResponse;
  semester: BaseResponse;
  student: TimeResponse;
  class: TimeResponse;
  department: TimeResponse;
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
  options?: OptionResponse[] | null;
}

export interface OptionResponse {
  id: number;
  content: string;
  mark: number;
}
