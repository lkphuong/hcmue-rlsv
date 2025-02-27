export interface LevelResponse {
  id: number | string;
  name: string;
  count: number;
  point?: string;
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

//#region report class
export interface SumOfClass {
  sum_of_std: number;
  sum_point: string;
}
export interface ExportWordTemplateClass {
  department: string;

  class_code: string;

  semester: string;

  academic_year: string;

  hour: number;

  minute: number;

  day: number;

  month: number;

  year: number;

  adviser: string;

  monitor: string;

  secretary: string;

  chairman: string;

  type: LevelResponse[];

  result: SumOfClass[];
}
//#endregion

export interface ItemResponse {
  index: number;
  name: string;
  ss: number;
  xs: number;
  t: number;
  kh: number;
  tb: number;
  y: number;
  k: number;
  kxl: number;
}

export interface TotalItemResponse {
  tss: number;
  txs: number;
  tt: number;
  tkh: number;
  ttb: number;
  ty: number;
  tk: number;
  tkxl: number;
}

export interface PercenItemResponse {
  pss: string;
  pxs: string;
  pt: string;
  pkh: string;
  ptb: string;
  py: string;
  pk: string;
  pkxl: string;
}
//#region report department
export interface ExportWordTemplateDepartment {
  semester: string;

  academic_year: string;

  hour: number;

  minute: number;

  day: number;

  month: number;

  year: number;

  department: string;

  class: ItemResponse[];

  total: TotalItemResponse[];

  percen: PercenItemResponse[];
}
//#endregion

//#region report admin
export interface ExportWordTemplateAdmin {
  semester: string;

  academic_year: string;

  hour: number;

  minute: number;

  day: number;

  month: number;

  year: number;

  department: ItemResponse[];

  total: TotalItemResponse[];

  percen: PercenItemResponse[];
}
//#endregion

export interface AmountLevelCacheDepartment {
  level_id: number;

  department_id: number;

  amount: number;
}
