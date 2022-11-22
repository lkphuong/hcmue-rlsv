export interface SemesterResponse {
  id: number;
  name: string;
}

export interface AcademicResponse {
  id: number;
  name: string;
}

export interface AcademicResponse {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  id: string;
  name: string;
}
export interface LevelResponse {
  id: number;
  name: string;
}

export interface ClassResponse {
  id: string;
  name: string;
}

export interface UserResponse {
  id: string;
  fullname: string;
  std_code: string;
}

export interface KResponse {
  id: string;
  name: string;
}

export interface HeaderResponse {
  id: number;
  name: string;
}

export interface ItemResponse {
  id: number;
  content: string;
}

export interface SheetUsersResponse {
  id: number;
  semester: SemesterResponse;
  academic: AcademicResponse;
  sum_of_personal_marks: number;
  sum_of_class_marks: number;
  sum_of_department_marks: number;
  level: LevelResponse;
  status: number;
}

export interface SheetClassResponse {
  id: number;
  user: UserResponse;
  sum_of_personal_marks: number;
  sum_of_class_marks: number;
  sum_of_department_marks: number;
  level: LevelResponse;
  status: number;
}

export interface EvaluationResponse {
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
  personal_mark_level: number;
  class_mark_level: number;
  department_mark_level: number;
}

export interface SheetDetailResponse {
  id: number;
  department: DepartmentResponse;
  class: ClassResponse;
  user: UserResponse;
  semester: SemesterResponse;
  academic: AcademicResponse;
  k: KResponse;
  level: LevelResponse;
  status: number;
  sum_of_personal_marks: number;
  sum_of_class_marks: number;
  sum_of_department_marks: number;
  headers: HeaderResponse[];
}

export interface MultiApproveResponse {
  sheet_ids: number[];
  success: boolean;
}

export interface SheetEvaluationResponse {
  id: number;
  semester: SemesterResponse;
  academic: AcademicResponse;
  evaluations: EvaluationResponse[];
}

export interface ItemDetailResponse {
  id: number;
  item: ItemResponse;
  option?: ItemResponse[];
  personal_mark_level: number;
  class_mark_level: number;
  department_mark_level: number;
}
