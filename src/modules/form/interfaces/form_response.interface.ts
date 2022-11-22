export interface FormResponse {
  ref?: string;
  parent_id: string;
  version?: string;
  original?: string;
  control: number;
  content: string;
  form_mark: number;
  to_mark: number;
  category: number;
  unit: number;
  required: boolean;
}

export interface BaseResponse {
  id: number;
  name: string;
}

export interface TimeResponse {
  start: Date;
  end: Date;
}

export interface FormInfoResponse {
  id: number;
  academic?: BaseResponse;
  semester?: BaseResponse;
  student?: TimeResponse;
  class?: TimeResponse;
  department?: TimeResponse;
}
