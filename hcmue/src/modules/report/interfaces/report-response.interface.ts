export interface LevelResponse {
  id: number | string;
  name: string;
  count: number;
}

export interface ReportResponse {
  id: string;
  name: string;
  levels: LevelResponse[] | null;
}
