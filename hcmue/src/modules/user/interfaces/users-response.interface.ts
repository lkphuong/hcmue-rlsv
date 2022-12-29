export interface BaseResponse {
  id: number;
  name: string;
}

export interface UserResponse {
  user_id: number;
  std_code: string;
  name: string;
  department: BaseResponse;
  classes: BaseResponse;
  role: number;
}

export interface ExcelDataResponse {
  k: string[];
  classes: ExcelClassResponse[];
  departments: string[];
  majors: ExcelMajorResponse[];
  statuses: string[];
}

export interface ExcelMajorResponse {
  name: string;
  department: string;
}

export interface ExcelClassResponse {
  code: string;
  name: string;
  department: string;
  k: string;
}
