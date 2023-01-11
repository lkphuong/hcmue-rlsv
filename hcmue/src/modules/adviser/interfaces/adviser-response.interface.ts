export interface ExcelAdviserResponse {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  department: string;
  class: string;
}

export interface ExcelAdviserClassResponse {
  email: string;
  class: string[];
}

export interface ExcelDataResponse {
  advisers: ExcelAdviserResponse[];
  classes: ExcelAdviserClassResponse[];
}
