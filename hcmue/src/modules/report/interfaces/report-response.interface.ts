export interface LevelResponse {
  id: number;
  name: string;
  count: number;
}

export interface ReportResponse {
  id: string;
  name: string;
  levels: LevelResponse[] | null;
}
