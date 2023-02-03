export interface LevelResponse {
  id: number | string;
  name: string;
  count: number;
}

export interface ClassResponse {
  id: number;
  name: string;
  code?: string;
  levels: LevelResponse[] | null;
  num_of_std: number;
}

export interface DepartmentResponse {
  id: number;
  name: string;
}

export interface AcademimcResponse {
  id: number;
  name: string;
}

export interface SemesterResponse {
  id: number;
  name: string;
  start: Date;
  end: Date;
}

export interface ReportResponse {
  department?: DepartmentResponse;
  academic?: AcademimcResponse;
  semester?: SemesterResponse;
  classes: ClassResponse[];
  sum_of_levels: LevelResponse[];
  sum_of_std_in_classes: number;
}

export interface ReportDepartmentsResponse {
  department?: DepartmentResponse;
  academic?: AcademimcResponse;
  semester?: SemesterResponse;
  departments: ClassResponse[];
  sum_of_levels: LevelResponse[];
  sum_of_std_in_departments: number;
}
