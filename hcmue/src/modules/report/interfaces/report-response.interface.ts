export interface LevelResponse {
  id: number | string;
  name: string;
  count: number;
}

export interface ClassResponse {
  id: string;
  name: string;
  levels: LevelResponse[] | null;
  num_of_std: number;
}

export interface ReportResponse {
  classes: ClassResponse[];
  sum_of_levels: LevelResponse[];
  sum_of_std_in_classes: number;
}
