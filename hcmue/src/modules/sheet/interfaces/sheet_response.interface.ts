export interface BaseResponse {
  id: number | string;
  name: string;
  max_mark?: number;
}

export interface UserResponse {
  fullname: string;
  std_code: string;
  birthday?: string;
  class?: {
    id: number;
    code: string;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
}

export interface MarkResponse {
  sum_of_personal_marks: number;
  sum_of_class_marks: number;
  sum_of_adviser_marks: number;
  sum_of_department_marks: number;
}

export interface ApproveAllResponse {
  sheet_ids: number[];
  success: boolean;
}

export interface UserSheetsResponse extends MarkResponse {
  id: number;
  semester: BaseResponse;
  academic: BaseResponse;
  level: BaseResponse;
  status: number;
}

export interface ClassSheetsResponse extends MarkResponse {
  id: number;
  user: UserResponse;
  level: BaseResponse;
  status: number;
}

export interface ReportResponse extends MarkResponse {
  std_code: string;
  fullname: string;
  birthday: string;
  class: string;
  department: string;
  sum_of_personal_marks: number;
  sum_of_class_marks: number;
  sum_of_adviser_marks: number;
  sum_of_department_marks: number;
  level: string;
  status: string;
  flag: number;
}

export interface ItemsResponse {
  id: number;
  item: ItemResponse;
  options?: OptionResponse[] | null;
  personal_mark_level: number;
  class_mark_level: number;
  department_mark_level: number;
}

export interface ItemResponse {
  id: number;
  content: string;
}

export interface OptionResponse {
  id: number;
  content: string;
}

export interface EvaluationsResponse {
  id: number;
  item: ItemResponse;
  options?: OptionResponse | null;
  files?: FileResponse[] | null;
  personal_mark_level: number;
  class_mark_level: number;
  adviser_mark_level: number;
  department_mark_level: number;
}

export interface FileResponse {
  id: number;
  name: string;
  url: string;
  type: number;
}

export interface EvaluationResponse extends MarkResponse {
  form_id: number;
  evaluation_id?: number;
  parent_id?: string;
  control: number;
  content: string;
  category?: number;
  from_mark: number;
  to_mark: number;
  unit: string;
  children: boolean;
}

export interface SheetDetailsResponse extends MarkResponse {
  id: number;
  department: BaseResponse;
  class: BaseResponse;
  user: UserResponse;
  semester: BaseResponse;
  academic: BaseResponse;
  k: BaseResponse;
  level?: BaseResponse;
  status: number;
  success: boolean;
  is_return?: boolean;
  headers: BaseResponse[];
  start: Date;
  end: Date;
}

export interface SheetEvaluationResponse {
  id: number;
  semester: BaseResponse;
  academic: BaseResponse;
  evaluations: EvaluationResponse[];
}

export interface SemesterResponse {
  id: number;
  name: string;
  start: Date;
  end: Date;
}

export interface AcademicYearResponse {
  id: number;
  name: string;
}

export interface ClassResponse {
  id: number;
  code: string;
  name: string;
  status: boolean;
  academic?: AcademicYearResponse;
  semester?: SemesterResponse;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  status: boolean;
}

export interface ManagerDepartmentResponse {
  academic: AcademicYearResponse;
  semester: SemesterResponse;
  department: DepartmentResponse[];
}

export interface ClassStatusResponse {
  academic?: AcademicYearResponse;
  semester?: SemesterResponse;
  class: ClassResponse[];
}
