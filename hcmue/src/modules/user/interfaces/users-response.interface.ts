export interface BaseResponse {
  id: number;
  name: string;
}

export interface ClassResponse {
  id: number;
  code: string;
  name: string;
}

export interface UserResponse {
  id: number;
  std_code: string;
  name: string;
  birthday: string;
  email: string;
  status: BaseResponse;
  academic: BaseResponse;
  department: BaseResponse;
  major: BaseResponse;
  classes: ClassResponse;
  k: BaseResponse;
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
