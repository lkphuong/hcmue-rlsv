export interface SemesterResponse {
  id: number;
  name: string;
  academic: {
    id: number;
    name: string;
  };
  start: Date;
  end: Date;
  display?: string;
}

export interface CreateSemesterResponse {
  id: number;
  name: string;
  start: Date;
  end: Date;
}
