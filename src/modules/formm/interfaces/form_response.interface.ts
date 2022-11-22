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
