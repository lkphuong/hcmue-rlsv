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
  academics: any[];
  classes: any[];
  departmentes: any[];
  majors: any[];
  statuses: any[];
}
