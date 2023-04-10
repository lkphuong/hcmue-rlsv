export interface ExcelAdviserResponse {
  first_name: string;
  last_name: string;
  code: string;
  phone_number: string;
  email: string;
  department: string;
  class: string;
  degree: string;
}

export interface ExcelAdviserClassResponse {
  email: string;
  class: string[];
}

export interface ExcelDataResponse {
  advisers: ExcelAdviserResponse[];
  classes: ExcelAdviserClassResponse[];
}

export interface ClassResponse {
  id: number;
  code: string;
  name: string;
}

export interface GetAdviserResponse {
  id: number;
  fullname: string;
  phone_number: string;
  email: string;
  degree: string;
  code: string;
  department: string;
  classes: string[];
}
