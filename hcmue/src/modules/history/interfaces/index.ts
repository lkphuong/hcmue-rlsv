export interface SheetHistoryResponse {
  id: number;

  fullname: string;

  role: number;

  created_at: Date;

  point: number;
}

export interface ItemResponse {
  id: number;

  mark: number;

  option_mark: number;
}

export interface EvaluationHistoryResponse {
  id: number;

  item_id: number;

  personal_mark_level: number;

  class_mark_level: number;

  adviser_mark_level: number;

  department_mark_level: number;
}
