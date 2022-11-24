export interface BaseResponse {
  id: number | string;
  name: string;
}

export interface UserResponse {
  id: string;
  fullname: string;
  std_code: string;
}

export interface ItemResponse {
  id: number;
  content: string;
}

export interface MarkResponse {
  sum_of_personal_marks: number;
  sum_of_class_marks: number;
  sum_of_department_marks: number;
}

export interface MultiApproveResponse {
  sheet_ids: number[];
  success: boolean;
}
export interface SheetUsersResponse extends MarkResponse {
  id: number;
  semester: BaseResponse;
  academic: BaseResponse;
  level: BaseResponse;
  status: number;
}

export interface SheetClassResponse extends MarkResponse {
  id: number;
  user: UserResponse;
  level: BaseResponse;
  status: number;
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

export interface SheetDetailResponse extends MarkResponse {
  id: number;
  department: BaseResponse;
  class: BaseResponse;
  user: UserResponse;
  semester: BaseResponse;
  academic: BaseResponse;
  k: BaseResponse;
  level: BaseResponse;
  status: number;
  headers: BaseResponse[];
}

export interface SheetEvaluationResponse {
  id: number;
  semester: BaseResponse;
  academic: BaseResponse;
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

export interface EvaluationDetailResponse {
  id: number;
  item: ItemResponse;
  option?: ItemResponse;
  personal_mark_level: number;
  class_mark_level: number;
  department_mark_level: number;
}
