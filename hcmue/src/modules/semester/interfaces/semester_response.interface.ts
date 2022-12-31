export interface SemesterResponse {
  id: number;
  name: string;
  academic: {
    id: number;
    name: string;
  };
  start: Date;
  end: Date;
}

export interface CreateSemesterResponse {
  id: number;
  name: string;
  start: Date;
  end: Date;
}
