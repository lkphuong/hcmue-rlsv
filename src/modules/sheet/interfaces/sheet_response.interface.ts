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
  mssv: string;
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
